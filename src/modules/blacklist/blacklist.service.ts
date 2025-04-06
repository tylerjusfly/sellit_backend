import type { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler.js';
import type { PostBlacklist } from '../../interfaces/blacklist.js';
import { dataSource } from '../../database/dataSource.js';
import { BlackLists } from '../../database/entites/blacklist.entity.js';
import type { IPaginate } from '../../interfaces/pagination.js';
import { Store } from '../../database/entites/store.entity.js';
import type { ITokenPayload } from '../../utils/token-helper.js';
import type { CustomRequest } from '../../middlewares/verifyauth.js';

export const CreateBlacklist = async (req: CustomRequest, res: Response) => {
	try {
		const { type, data, note }: PostBlacklist = req.body;

		const store = req.user as ITokenPayload;

		const isShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: store.id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		const ToCreate = dataSource.getRepository(BlackLists).create({
			shop_id: isShop.id,
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

export const fetchBlacklist = async (req: CustomRequest, res: Response) => {
	try {
		const { page, limit }: { shop_id?: string; page?: number; limit?: number } = req.query;

		const store = req.user as ITokenPayload;

		const page_limit = limit ? Number(limit) : 10;

		const offset = page ? (Number(page) - 1) * page_limit : 0;

		const isShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: store.id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		const [Lists, total] = await BlackLists.findAndCount({
			where: {
				shop_id: store.id,
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
		const { uuid }: { uuid?: string } = req.query;

		if (!uuid) {
			return handleBadRequest(res, 400, 'record id is required to delete record');
		}

		const isItem = await dataSource.getRepository(BlackLists).findOne({
			where: { id: uuid },
		});

		if (!isItem) return handleBadRequest(res, 400, 'cannot delete unexisting blacklist');

		await isItem.remove();

		return handleSuccess(res, null, 'dropped', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const isDataInBlacklist = async (req: Request, res: Response) => {
	try {
		const { data, type }: { data: string; type: string } = req.body;

		const isItem = await dataSource.getRepository(BlackLists).findOne({
			where: { data: data, type: type },
		});

		if (isItem) {
			return handleBadRequest(res, 400, 'You have been blacklisted by store owner.');
		}

		return handleSuccess(res, null, 'not blacklisted', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};
