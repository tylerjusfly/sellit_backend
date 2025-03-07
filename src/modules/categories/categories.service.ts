import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { dataSource } from '../../database/dataSource';
import { ICategories, IgetAllCategory } from '../../interfaces/categories';
import { Categories } from '../../database/entites/categories.entity';
import { CustomRequest } from '../../middlewares/verifyauth';
import { ITokenPayload } from '../../utils/token-helper';
import { Store } from '../../database/entites/store.entity';

export const CreateCategories = async (req: CustomRequest, res: Response) => {
	try {
		const { category_name }: ICategories = req.body;

		const user = req.user as ITokenPayload;

		let shop_id = user.id;

		const isShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shop_id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'store not found');

		const categoryCreate = dataSource.getRepository(Categories).create({
			shop_id,
			category_name,
			shop_name: isShop.storename,
		});

		const result = await categoryCreate.save();

		return handleSuccess(res, result, 'created category', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const fetchCategories = async (req: Request, res: Response) => {
	try {
		const { shop_id, shop_name }: IgetAllCategory = req.query;

		if (!shop_id && !shop_name) {
			return handleBadRequest(res, 400, 'Either shop_id or shop_name is required');
		}

		let shop: Store | null = null;

		const shopRepository = dataSource.getRepository(Store);

		if (shop_id) {
			shop = await shopRepository
				.createQueryBuilder('shop')
				.where('shop.id = :id', { id: shop_id })
				.getOne();
		} else if (shop_name) {
			shop = await shopRepository
				.createQueryBuilder('shop')
				.where('shop.storename = :name', { name: shop_name })
				.getOne();
		}

		if (!shop) {
			return handleBadRequest(res, 404, 'Shop not found');
		}

		const [CategoryItems, total] = await Categories.findAndCount({
			where: {
				shop_id: shop.id,
			},
			order: {
				created_at: 'DESC',
			},
		});

		return handleSuccess(res, CategoryItems, `categories`, 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const deleteCategories = async (req: Request, res: Response) => {
	try {
		const { uuid }: { uuid?: string } = req.query;

		if (!uuid) {
			return handleBadRequest(res, 400, 'category id is required');
		}

		const isCategory = await dataSource.getRepository(Categories).findOne({
			where: { id: uuid },
		});

		if (!isCategory) return handleBadRequest(res, 400, 'cannot delete unexisting category');

		await isCategory.softRemove();

		return handleSuccess(res, null, 'category dropped', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

// export const editCategories = async (req: CustomRequest, res: Response) => {
// 	try {
// 		const { id }: { id?: string } = req.query;

// 		const { category_name, category_postion, items }: IeditCategories = req.body;

// 		// Find coupon
// 		const foundCategory = await Categories.findOneBy({ id });

// 		if (!foundCategory) {
// 			return handleBadRequest(res, 404, 'coupon not found');
// 		}

// 		if (category_name && category_name !== '') {
// 			foundCategory.category_name = category_name;
// 		}

// 		if (category_postion && category_postion >= 1) {
// 			foundCategory.category_postion = category_postion;
// 		}

// 		if (items) {
// 			foundCategory.products = items;
// 		}

// 		const user = req.user as ITokenPayload;

// 		foundCategory.lastChanged_by = user.storename;

// 		await foundCategory.save();

// 		return handleSuccess(res, foundCategory, 'updated category', 200, undefined);
// 	} catch (error) {
// 		return handleError(res, error);
// 	}
// };

// export const fetchCategoriesByShopName = async (req: Request, res: Response) => {
// 	try {
// 		const { name }: { name?: string } = req.query;

// 		if (!name) {
// 			return handleBadRequest(res, 400, 'shop name is required');
// 		}

// 		// const slugged = convertToSlug(name);

// 		// const isShop = await dataSource
// 		// 	.getRepository(Store)
// 		// 	.createQueryBuilder('shop')
// 		// 	.where('shop.slug = :name', { name: slugged })
// 		// 	.getOne();

// 		// if (!isShop) return handleBadRequest(res, 404, 'shop not found');

// 		const AllCategories = await Categories.find({
// 			where: {
// 				shop_id: isShop.id,
// 			},
// 			order: {
// 				created_at: 'DESC',
// 			},
// 		});

// 		return handleSuccess(res, AllCategories, `categories`, 200, undefined);
// 	} catch (error) {
// 		return handleError(res, error);
// 	}
// };
