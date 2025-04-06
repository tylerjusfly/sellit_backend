import type { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler.js';
import { dataSource } from '../../database/dataSource.js';

import { Tickets } from '../../database/entites/ticket.entity';
import { IPaginate } from '../../interfaces/pagination';
import { Store } from '../../database/entites/store.entity.js';

export type PostTickets = {
	shop_id: number;
	order_id: string;
	piority: string;
	message: string;
};

export const CreateTicket = async (req: Request, res: Response) => {
	try {
		const { shop_id, order_id, piority, message }: PostTickets = req.body;

		const isShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shop_id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		const ToCreate = dataSource.getRepository(Tickets).create({
			shop_id: shop_id,
			order_id,
			piority,
			message,
		});

		const result = await ToCreate.save();

		return handleSuccess(res, result, 'created', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const fetchTickets = async (req: Request, res: Response) => {
	try {
		const { shop_id, page, limit }: { shop_id?: number; page?: number; limit?: number } = req.query;

		if (!shop_id) {
			return handleBadRequest(res, 400, 'shop is required');
		}

		const page_limit = limit ? Number(limit) : 10;

		const offset = page ? (Number(page) - 1) * page_limit : 0;

		const isShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shop_id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		const [Lists, total] = await Tickets.findAndCount({
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
