import type { Response, Request } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler.js';
import { dataSource } from '../../database/dataSource.js';
import { Product } from '../../database/entites/product.entity.js';
import type {
	IEditProduct,
	IStoreProduct,
	IgetAllProduct,
	IgetPublicProduct,
} from '../../interfaces/product.js';
import type { CustomRequest } from '../../middlewares/verifyauth.js';
import type { ITokenPayload } from '../../utils/token-helper.js';
import type { IPaginate } from '../../interfaces/pagination.js';
import { Brackets } from 'typeorm';

import { Store } from '../../database/entites/store.entity.js';
import { ProductItems } from '../../database/entites/productitem.entity.js';

export const CreateProduct = async (req: CustomRequest, res: Response) => {
	try {
		const { productName, productType, description, categoryid } = req.body;

		if (!productName || !productType || !description || !categoryid) {
			return handleBadRequest(res, 400, 'required fields are missings');
		}

		const store = req.user as ITokenPayload;

		const UserShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: store.id })
			.getOne();

		if (!UserShop) return handleBadRequest(res, 404, 'shop not found');

		// Create Product
		const createProductObj = dataSource.getRepository(Product).create({
			shop_id: UserShop,
			name: productName,
			product_type: productType,
			description: description,
			categoryid,
		});

		const result = await dataSource.getRepository(Product).save(createProductObj);

		return handleSuccess(res, result, 'created product', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const editProduct = async (req: CustomRequest, res: Response) => {
	const queryRunner = dataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		const { id, items, ...restData }: IEditProduct = req.body;
		const user = req.user as ITokenPayload;

		// 1. Find and update the product
		const productObj = await Product.findOne({
			where: { id },
		});

		if (!productObj) {
			return handleBadRequest(res, 404, 'product does not exist');
		}

		Object.assign(productObj, restData);

		productObj.lastChanged_by = user.email;

		// 2. Handle stock calculation
		if (productObj.product_type === 'serial' && items && items !== '') {
			// Split by either comma or newline and trim each serial
			const itemsArray = items
				.split(/[\n]/)
				.map((item) => item.trim())
				.filter((item) => item.length > 0);

			productObj.stock = itemsArray.length;

			// 3. Process serials in transaction
			// Delete existing serials for this product
			await queryRunner.manager.delete(ProductItems, { product: id });

			// Insert new serials
			if (itemsArray.length > 0) {
				const serials = itemsArray.map((serial) => ({
					item: serial,
					store_id: productObj.shop_id.id,
					product: productObj,
				}));

				await queryRunner.manager.insert(ProductItems, serials);
			}
		}

		if (productObj.product_type === 'file' && restData.file_url && restData.file_url !== '') {
			productObj.stock = +restData.stock;

			// Delete existing serials for this product
			await queryRunner.manager.delete(ProductItems, { product: id });

			// Insert new item

			const filePayload = {
				item: restData.file_url,
				store_id: productObj.shop_id.id,
				product: productObj,
			};

			await queryRunner.manager.insert(ProductItems, filePayload);
		}

		if (productObj.product_type === 'service') {
			productObj.stock = +restData.stock;
		}

		// 4. Save everything
		await queryRunner.manager.save(productObj);
		await queryRunner.commitTransaction();

		return handleSuccess(res, productObj, 'updated product', 200, undefined);
	} catch (error) {
		await queryRunner.rollbackTransaction();
		handleError(res, error);
	} finally {
		await queryRunner.release();
	}
};

export const getSpecificProduct = async (req: Request, res: Response) => {
	const queryRunner = dataSource.createQueryRunner();
	await queryRunner.connect();

	try {
		const { id }: { id?: string } = req.query;

		if (!id) {
			return handleBadRequest(res, 400, 'id is required');
		}

		// Get product and its category in one query
		const foundProduct = await queryRunner.manager
			.getRepository(Product)
			.createQueryBuilder('product')
			.leftJoinAndSelect('product.categoryid', 'category')
			.where('product.id = :id', { id })
			.getOne();

		if (!foundProduct) {
			return handleBadRequest(res, 404, 'product does not exist');
		}

		// Get related items in separate query
		const productItems = await queryRunner.manager
			.getRepository(ProductItems)
			.createQueryBuilder('item')
			.leftJoin('item.product', 'product')
			.where('product.id = :id', { id })
			.select(['item.id', 'item.item']) // Only select needed fields
			.getMany();

		// Combine the results
		foundProduct.items = productItems.map((item) => item.item).join('\n');
		foundProduct.file_url = productItems[0]?.item || ""


		return handleSuccess(res, foundProduct, 'Product found', 200, undefined);
	} catch (error: any) {
		if (error.name === 'EntityNotFoundError') {
			return handleBadRequest(res, 404, 'product does not exist');
		}
		return handleError(res, error);
	} finally {
		await queryRunner.release();
	}
};

export const getAllProductByShop = async (req: Request, res: Response) => {
	try {
		const { shopid, page, limit, unlisted, search }: IgetAllProduct = req.query;

		if (!shopid) {
			return handleBadRequest(res, 400, 'shopid is required');
		}

		const page_limit = limit ? Number(limit) : 10;

		const offset = page ? (Number(page) - 1) * page_limit : 0;

		// Find shop
		const foundShop = await Store.findOne({
			where: {
				id: shopid,
			},
		});

		if (!foundShop) return handleBadRequest(res, 404, 'shop not found');

		// fetch all shop product
		const query = dataSource
			.getRepository(Product)
			.createQueryBuilder('q')
			.select(['q.id', 'q.name', 'q.product_type', 'q.amount', 'q.stock']);

		query.where('q.shop_id = :val', { val: shopid });

		if (search && search !== '') {
			query.andWhere(
				new Brackets((qb) => {
					qb.where('LOWER(q.name) Like :name', { name: `%${search.toLowerCase()}%` });
				})
			);
		}

		const AllProducts = await query
			.offset(offset)
			.limit(page_limit)
			.orderBy('q.created_at', 'DESC')
			.getMany();

		const Productcount = await query.getCount();

		const totalPages = Math.ceil(Productcount / page_limit);

		const paging: IPaginate = {
			totalItems: Productcount,
			currentPage: page ? Number(page) : 1,
			totalpages: totalPages,
			itemsPerPage: page_limit,
		};

		return handleSuccess(res, AllProducts, `All Products`, 200, paging);
	} catch (error) {
		return handleError(res, error);
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const { uuid }: { uuid?: string } = req.query;

		if (!uuid) {
			return handleBadRequest(res, 400, 'product id is required');
		}

		const isProduct = await dataSource.getRepository(Product).findOne({
			where: { id: uuid },
		});

		if (!isProduct) return handleBadRequest(res, 400, 'cannot delete unexisting product');

		await isProduct.softRemove();

		return handleSuccess(res, null, 'shop dropped', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const getProductsForPublic = async (req: Request, res: Response) => {
	try {
		const { storeid, limit, page, search, categoryid }: IgetPublicProduct = req.query;

		const page_limit = limit ? Number(limit) : 20;

		const offset = page ? (Number(page) - 1) * page_limit : 0;

		// fetch all shop product
		const query = dataSource
			.getRepository(Product)
			.createQueryBuilder('q')
			.leftJoinAndSelect('q.categoryid', 'category')
			.select(['q.id', 'q.name', 'q.image_src', 'q.amount', 'q.stock']);

		query.where('q.shop_id = :shop_id', { shop_id: storeid });
		query.andWhere('q.unlisted = :unlisted', { unlisted: 'false' });
		query.andWhere('q.private_mode = :val', { val: 'false' });

		if (categoryid && categoryid !== '') {
			query.andWhere('q.categoryid = :catid', { catid: categoryid });
		}

		if (search && search !== '') {
			query.andWhere(
				new Brackets((qb) => {
					qb.where('LOWER(q.name) Like :name', { name: `%${search.toLowerCase()}%` });
				})
			);
		}

		const AllProducts = await query
			.offset(offset)
			.limit(page_limit)
			.orderBy('q.created_at', 'DESC')
			.getMany();

		const Productcount = await query.getCount();

		const totalPages = Math.ceil(Productcount / page_limit);

		const paging: IPaginate = {
			totalItems: Productcount,
			currentPage: page ? Number(page) : 1,
			totalpages: totalPages,
			itemsPerPage: page_limit,
		};

		return handleSuccess(res, AllProducts, `All Products`, 200, paging);
	} catch (error) {
		return handleError(res, error);
	}
};

export const getOneProduct = async (req: Request, res: Response) => {
	try {
		const { id }: { id?: string } = req.query;

		if (!id) {
			return handleBadRequest(res, 400, 'id is required');
		}

		const foundProduct = await dataSource
			.getRepository(Product)
			.createQueryBuilder('product')
			.addSelect('product.shop_id')
			.select([
				'product.id',
				'product.name',
				'product.stock',
				'product.image_src',
				'product.amount',
				'product.description',
				'product.product_type',
				'product.max_purchase',
				'product.min_purchase',
				// 'product.stripe',
				// 'product.coinbase_key',
				// 'product.cashapp',
				// 'product.product_type',
				// 'product.shop_id',
				// 'product.webhook_url',
				// 'product.callback_url',
			])
			.where('product.id = :val', { val: id })
			.andWhere('product.unlisted= :value', { value: false })
			.getOne();

		if (!foundProduct) {
			return handleBadRequest(res, 404, 'product does not exist');
		}

		return handleSuccess(res, foundProduct, 'found', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

// const foundProduct = await dataSource
// 	.getRepository(Product)
// 	.createQueryBuilder('q') // Alias 'q'
// 	.leftJoinAndSelect('q.categoryid', 'category')
// 	.select([
// 		'q.id',
// 		'q.name',
// 		'q.image_src',
// 		'q.amount',
// 		'q.stock',
// 		'category.id', // Need to explicitly select joined columns
// 	])
// 	.where('q.id = :val', { val: id }) // Must use 'q' to match alias
// 	.getOne();
