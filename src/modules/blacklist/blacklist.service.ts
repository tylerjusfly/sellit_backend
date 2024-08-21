import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { PostBlacklist } from '../../interfaces/blacklist';
import { dataSource } from '../../database/dataSource';
import { Shop } from '../../database/entites/shop.entity';
import { BlackLists } from '../../database/entites/blacklist.entity';
import { IPaginate } from '../../interfaces/pagination';

export const CreateBlacklist = async (req: Request, res: Response) => {
	try {
		const { shop_id, type, data, note }: PostBlacklist = req.body;

		const isShop = await dataSource
			.getRepository(Shop)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shop_id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		const ToCreate = dataSource.getRepository(BlackLists).create({
			shop_id: shop_id,
			type,
			data,
			note,
		});

		const result = await ToCreate.save();

		return handleSuccess(res, result, 'created', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const fetchBlacklist = async (req: Request, res: Response) => {
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

		const [Lists, total] = await BlackLists.findAndCount({
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

		return handleSuccess(res, Lists, ``, 200, paging);
	} catch (error) {
		return handleError(res, error);
	}
};

export const deleteBlacklist = async (req: Request, res: Response) => {
	try {
		const { uuid }: { uuid?: number } = req.query;

		if (!uuid) {
			return handleBadRequest(res, 400, 'coupon id is required');
		}

		const isItem = await dataSource.getRepository(BlackLists).findOne({
			where: { id: uuid },
		});

		if (!isItem) return handleBadRequest(res, 400, 'cannot delete unexisting coupon');

		await isItem.softRemove();

		return handleSuccess(res, null, 'dropped', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};
