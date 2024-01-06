import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { ICategories, IeditCategories, IgetAllCat } from '../../interfaces/categories';
import { dataSource } from '../../database/dataSource';
import { Categories } from '../../database/entites/categories.entity';
import { Shop } from '../../database/entites/shop.entity';
import { GenerateCategoryid } from '../../utils/generateIds';
import { IPaginate } from '../../interfaces/pagination';
import { ILike } from 'typeorm';
import { ITokenPayload } from '../../utils/token-helper';
import { CustomRequest } from '../../middlewares/verifyauth';

const isCategoryUnique = async (shopId: number, name: string): Promise<boolean> => {
	const existingCategory = await dataSource
		.getRepository(Categories)
		.createQueryBuilder('cat')
		.where('cat.shop_id = :shopId', { shopId })
		.andWhere('cat.category_name = :name', { name })
		.getOne();

	return !existingCategory;
};

export const CreateCategories = async (req: Request, res: Response) => {
	try {
		const { shop_id, category_name }: ICategories = req.body;

		if (!shop_id || !category_name) {
			return handleBadRequest(res, 400, 'shop id or name is required');
		}

		const isShop = await dataSource
			.getRepository(Shop)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shop_id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		//check if category name already exist
		const isUnique = await isCategoryUnique(shop_id, category_name);

		if (!isUnique) {
			return handleBadRequest(res, 400, 'you already created this category');
		}

		// Generate new unique Category ID
		const category_id = GenerateCategoryid();

		const categoryCreate = dataSource.getRepository(Categories).create({
			shop_id,
			category_name,
			category_id,
			shop_name: isShop.name,
		});

		const result = await categoryCreate.save();

		return handleSuccess(res, result, 'created category', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const fetchCategories = async (req: Request, res: Response) => {
	try {
		const { shop_id, page, limit, value }: IgetAllCat = req.query;

		if (!shop_id) {
			return handleBadRequest(res, 400, 'shop is required');
		}

		const page_limit = limit ? Number(limit) : 10;

		const offset = page ? (Number(page) - 1) * page_limit : 0;

		const isShop = await dataSource
			.getRepository(Shop)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shop_id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		const [Category, total] = await Categories.findAndCount({
			where: {
				shop_id,
				category_name: ILike(`%${value}%`),
			},
			skip: offset,
			take: page_limit,
			order: {
				created_at: 'DESC',
			},
		});

		const paging: IPaginate = {
			totalItems: total,
			currentPage: page ? Number(page) : 1,
			totalpages: Math.ceil(total / page_limit),
			itemsPerPage: page_limit,
		};

		return handleSuccess(res, Category, `categories`, 200, paging);
	} catch (error) {
		return handleError(res, error);
	}
};

export const deleteCategories = async (req: Request, res: Response) => {
	try {
		const { uuid }: { uuid?: number } = req.query;

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

export const fetchSingleCategory = async (req: Request, res: Response) => {
	try {
		const { shop_id, unique_id }: { shop_id?: number; unique_id?: string } = req.query;

		if (!shop_id || !unique_id) {
			return handleBadRequest(res, 400, 'shop/unique_id is required');
		}

		const foundCategory = await Categories.findOne({
			where: {
				category_id: unique_id,
				shop_id: shop_id,
			},
		});

		if (!foundCategory) {
			return handleBadRequest(res, 404, 'category not found');
		}

		return handleSuccess(res, foundCategory, `category`, 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const editCategories = async (req: CustomRequest, res: Response) => {
	try {
		const { id }: { id?: number } = req.query;

		const { category_name, category_postion, items }: IeditCategories = req.body;

		// Find coupon
		const foundCategory = await Categories.findOneBy({ id });

		if (!foundCategory) {
			return handleBadRequest(res, 404, 'coupon not found');
		}

		if (category_name && category_name !== '') {
			foundCategory.category_name = category_name;
		}

		if (category_postion && category_postion >= 1) {
			foundCategory.category_postion = category_postion;
		}

		if (items) {
			foundCategory.products = items;
		}

		const user = req.user as ITokenPayload;

		foundCategory.lastChanged_by = user.username;

		await foundCategory.save();

		return handleSuccess(res, foundCategory, 'updated category', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};