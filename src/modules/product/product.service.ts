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
	try {
		const { id, items, ...restData }: IEditProduct = req.body;

		const productObj = await Product.findOne({
			where: {
				id,
			},
		});

		if (!productObj) {
			return handleBadRequest(res, 404, 'product does not exist');
		}

		Object.assign(productObj, restData);

		productObj.items = items || null;

		if (items && items !== '') {
			const itemsArray = items?.split(',').map((item) => item.trim());
			productObj.stock = itemsArray.length;
		} else {
			productObj.stock = +restData.stock;
		}

		const user = req.user as ITokenPayload;

		productObj.lastChanged_by = user.email;

		await productObj.save();

		return handleSuccess(res, productObj, 'updated product', 200, undefined);
	} catch (error) {
		handleError(res, error);
	}
};

export const getSpecificProduct = async (req: Request, res: Response) => {
	try {
		const { id }: { id?: string } = req.query;

		if (!id) {
			return handleBadRequest(res, 400, 'id is required');
		}

		const foundProduct = await Product.findOneOrFail({
			where: {
				id: id,
			},
		});

		return handleSuccess(res, foundProduct, 'found', 200, undefined);
	} catch (error: any) {
		if (error.name === 'EntityNotFoundError') {
			return handleBadRequest(res, 404, 'product does not exist');
		}
		return handleError(res, error);
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
			// .leftJoinAndSelect('q.categoryid', 'category')
			.select(['q.id', 'q.name', 'q.product_type', 'q.amount', 'q.stock']);

		query.where('q.shop_id = :val', { val: shopid });

		if (search && search !== '') {
			query.andWhere(
				new Brackets((qb) => {
					qb.where('LOWER(q.name) Like :name', { name: `%${search.toLowerCase()}%` });
				})
			);
		}

		/**
		 SELECT * FROM articles
WHERE to_tsvector('english', body) @@ to_tsquery('running');

		 */

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

// export const getAllProductByShopname = async (req: Request, res: Response) => {
// 	try {
// 		const { shopname, search, page, category, limit }: IStoreProduct = req.query;

// 		if (!shopname) {
// 			return handleBadRequest(res, 400, 'shop id/name is required');
// 		}

// 		const page_limit = limit ? limit : 20;

// 		const offset = page ? (Number(page) - 1) * page_limit : 0;

// 		const slugged = convertToSlug(shopname);

// 		// Find shop
// 		const foundShop = await Store.findOne({
// 			where: {
// 				slug: slugged,
// 			},
// 		});

// 		if (!foundShop) return handleBadRequest(res, 404, 'shop not found');

// 		// fetch all shop product
// 		const query = dataSource.getRepository(Product).createQueryBuilder('q').select([
// 			'q.id',
// 			'q.name',
// 			'q.unique_id',
// 			'q.image_src',
// 			'q.stock',
// 			// 'q.unlisted',
// 			'q.paypal',
// 			'q.stripe',
// 			'q.crypto',
// 			'q.cashapp',
// 			// 'q.product_type',
// 			'q.amount',
// 			// 'q.service_info',
// 			'q.description',
// 			// 'q.webhook_url',
// 			'q.callback_url',
// 		]);

// 		query.where('q.shop_id = :val', { val: foundShop.id });

// 		query.andWhere('q.unlisted = :value', { value: false });

// 		if (search && search !== '') {
// 			query.andWhere(
// 				new Brackets((qb) => {
// 					qb.where('LOWER(q.name) Like :name', { name: `%${search.toLowerCase()}%` });
// 				})
// 			);
// 		}

// 		const AllProducts = await query
// 			.offset(offset)
// 			.limit(page_limit)
// 			.orderBy('q.created_at', 'DESC')
// 			.getMany();

// 		const Productcount = await query.getCount();

// 		const totalPages = Math.ceil(Productcount / page_limit);

// 		const paging: IPaginate = {
// 			totalItems: Productcount,
// 			currentPage: page ? Number(page) : 1,
// 			totalpages: totalPages,
// 			itemsPerPage: page_limit,
// 		};

// 		return handleSuccess(
// 			res,
// 			{
// 				// shop: foundShop,
// 				products: AllProducts,
// 			},
// 			`All Products`,
// 			200,
// 			paging
// 		);
// 	} catch (error) {
// 		return handleError(res, error);
// 	}
// };

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

export const getOneP = async (req: Request, res: Response) => {
	try {
		// const dd = await queueMicrotask
		// 		SELECT * FROM articles
		// WHERE to_tsvector(body|| ""|| text) @@ to_tsquery('running');

		return handleSuccess(res, {}, 'found', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};
