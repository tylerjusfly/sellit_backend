import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { ICategories } from '../../interfaces/categories';
import { dataSource } from '../../database/dataSource';
import { Categories } from '../../database/entites/categories.entity';
import { Shop } from '../../database/entites/shop.entity';
import { GenerateCategoryid } from '../../utils/generateIds';
import { IPaginate } from '../../interfaces/pagination';

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
		const { shop_id, page, limit }: { shop_id?: number; page?: number; limit?: number } = req.query;

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
			},
			skip: offset,
			take: page_limit,
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
