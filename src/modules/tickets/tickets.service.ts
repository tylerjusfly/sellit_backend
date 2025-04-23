import type { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler.js';
import { dataSource } from '../../database/dataSource.js';

import { Tickets } from '../../database/entites/ticket.entity.js';
import type { IPaginate } from '../../interfaces/pagination.js';
import { Store } from '../../database/entites/store.entity.js';
import type { CustomRequest } from '../../middlewares/verifyauth.js';
import type { ITokenPayload } from '../../utils/token-helper.js';
import { nanoid } from 'nanoid';
import { sendNotification, sendStoreEmail } from '../notifications/notification.service.js';
import { ENV } from '../../constants/env-variables.js';

export type PostTickets = {
	shop_id: string;
	order_id: string;
	title: string;
	email: string;
};

export const CreateTicket = async (req: Request, res: Response) => {
	try {
		const { shop_id, order_id, title, email }: PostTickets = req.body;

		const isShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shop_id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, `Error finding Store, Please try again.`);

		const ticket_id = nanoid(10);

		const ToCreate = dataSource.getRepository(Tickets).create({
			shop_id: shop_id,
			order_id,
			resolved: false,
			email,
			title,
			ticket_id: `Tkt-${ticket_id}`,
		});

		const result = await ToCreate.save();

		await sendNotification(
			isShop.id,
			`${email} has created a ticket, TicketID: Tkt-${ticket_id} `,
			'info',
			`${title}`
		);

		if (isShop.create_ticket === true) {
			sendStoreEmail(isShop.email, {
				storename: isShop.storename,
				message: `We noticed a customer with ${email} just created a ticket for your store. Please log in to view the details.`,
				ticket_id: `Tkt-${ticket_id}`,
				ctaLabel: 'View Ticket',
				ctaUrl: `${ENV.FRONTEND_URL}/shop/tickets/Tkt-${ticket_id}`,
			});
		}

		return handleSuccess(res, result, 'created', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const fetchStoreTickets = async (req: CustomRequest, res: Response) => {
	try {
		const { page, limit }: { page?: number; limit?: number } = req.query;

		const page_limit = limit ? Number(limit) : 10;

		const offset = page ? (Number(page) - 1) * page_limit : 0;

		const store = req.user as ITokenPayload;

		const isShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: store.id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		const [Lists, total] = await Tickets.findAndCount({
			where: {
				shop_id: store.id,
			},
			skip: offset,
			take: page_limit,
			order: { updated_at: 'DESC' },
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

export const resolveTickets = async (req: CustomRequest, res: Response) => {
	try {
		const { uuid }: { uuid?: string } = req.query;

		if (!uuid) {
			return handleBadRequest(res, 400, 'ticket ID is required');
		}

		const store = req.user as ITokenPayload;

		const TicketData = await dataSource.getRepository(Tickets).findOne({
			where: {
				id: uuid,
				shop_id: store.id,
			},
			loadEagerRelations: false,
		});

		if (!TicketData) {
			return handleBadRequest(res, 400, 'Ticket cannot be found, Verify ticket ID.');
		}

		if (TicketData.resolved) {
			return handleBadRequest(res, 400, 'This ticket has already been marked as resolved.');
		}

		TicketData.resolved = true;

		TicketData.save();

		return handleSuccess(res, '', '', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const searchTickets = async (req: CustomRequest, res: Response) => {
	const {
		page = '1',
		limit = '20',
		search = '',
	}: { page?: string; limit?: string; search?: string } = req.query;

	const pageNum = parseInt(page, 10);
	const limitNum = parseInt(limit, 10);
	const offset = (pageNum - 1) * limitNum;

	const store = req.user as ITokenPayload;

	try {
		const query = `
			SELECT * FROM tickets
			WHERE to_tsvector('english', 
				COALESCE(CAST(ticket_id AS TEXT), '') || ' ' || 
				COALESCE(order_id, '') || ' ' || 
				COALESCE(email, '')
			) @@ plainto_tsquery('english', $1)
			ORDER BY created_at DESC
			LIMIT $2 OFFSET $3
		`;

		const values = [search, limitNum, offset];
		const result = await dataSource.query(query, values);

		// const paging: IPaginate = {
		// 	totalItems: result.length,
		// 	currentPage: page ? Number(page) : 1,
		// 	totalpages: Math.ceil(result.length / limitNum),
		// 	itemsPerPage: limitNum,
		// };

		return handleSuccess(res, result, ``, 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};