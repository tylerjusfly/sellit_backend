import type { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler.js';
import type { CustomRequest } from '../../middlewares/verifyauth.js';
import type { cJwtPayload } from '../../utils/token-helper.js';
import { dataSource } from '../../database/dataSource.js';
import { Store } from '../../database/entites/store.entity.js';
import type { NotificationType } from '../../interfaces/shop.js';

export const getshopdata = async (req: CustomRequest, res: Response) => {
	try {
		const userReq = req.user as cJwtPayload;

		const query = dataSource
			.getRepository(Store)
			.createQueryBuilder('q')
			.select(['q.id', 'q.storename', 'q.display_picture', 'q.domain_name', 'q.hero_text']);

		query.where('q.id = :val', { val: userReq.id });

		const StoreData = await query.getOneOrFail();

		return handleSuccess(res, StoreData, 'store', 200, undefined);
	} catch (error) {
		return handleError(res, error || { message: 'Error finding store' });
	}
};

export const updateStorename = async (req: CustomRequest, res: Response) => {
	try {
		const { storename } = req.body;
		const storeReq = req.user as cJwtPayload;

		// Perform update only if there is valid data
		await dataSource.getRepository(Store).update(
			{ id: storeReq.id }, // Condition
			{ storename: storename, domain_name: `${storename}.sellit.app` }
		);

		return handleSuccess(res, {}, 'Store updated successfully', 200, undefined);
	} catch (error) {
		return handleError(res, error || { message: 'Error updating store' });
	}
};

export const getstoreInPublic = async (req: Request, res: Response) => {
	const { storename } = req.query;
	try {
		const storeData = await dataSource.query(
			`
			SELECT
				s.id,
				s.storename,
				s.display_picture,
				s.domain_name,
				s.hero_text,
				c.main_color,
				c.hero_svg
			FROM stores s
			LEFT JOIN customizations c ON s.customizationid = c.id
			WHERE s.storename = $1
			LIMIT 1
			`,
			[storename]
		);

		res.setHeader('Cache-Control', 'public, max-age=10');

		return handleSuccess(res, storeData[0], 'store', 200, undefined);
	} catch (error) {
		return handleError(res, error || { message: 'Error finding store' });
	}
};

export const fetchNotificationSettings = async (req: CustomRequest, res: Response) => {
	try {
		const storeReq = req.user as cJwtPayload;

		const query = dataSource
			.getRepository(Store)
			.createQueryBuilder('q')
			.select(['q.create_ticket', 'q.reply_ticket']);

		query.where('q.id = :val', { val: storeReq.id });

		const StoreItem = await query.getOneOrFail();

		return handleSuccess(res, StoreItem, '', 200, undefined);
	} catch (error) {
		return handleError(res, error || { message: 'Error finding store' });
	}
};

export const updateNotificationSettings = async (req: CustomRequest, res: Response) => {
	const { create_ticket, reply_ticket }: NotificationType = req.body;

	try {
		const storeReq = req.user as cJwtPayload;

		const query = dataSource
			.getRepository(Store)
			.createQueryBuilder('q')
			.select(['q.id', 'q.create_ticket', 'q.reply_ticket']);

		query.where('q.id = :val', { val: storeReq.id });

		const StoreItem = await query.getOneOrFail();

		const shouldUpdate = create_ticket !== undefined || reply_ticket !== undefined;

		if (shouldUpdate) {
			if (create_ticket !== undefined) {
				StoreItem.create_ticket = create_ticket;
			}

			if (reply_ticket !== undefined) {
				StoreItem.reply_ticket = reply_ticket;
			}

			await StoreItem.save();
		}

		return handleSuccess(res, StoreItem, '', 200, undefined);
	} catch (error) {
		return handleError(res, error || { message: 'Error finding store' });
	}
};
