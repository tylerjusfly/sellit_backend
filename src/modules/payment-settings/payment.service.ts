import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { dataSource } from '../../database/dataSource';
import { Shop } from '../../database/entites/shop.entity';
import { findShop } from '../../utils/shopchecker';

type PAYMENT_TYPE = 'Coinbase' | 'Stripe' | 'Paypal' | 'CashApp';

export const fetchShopPayments = async (req: Request, res: Response) => {
	try {
		const { shopid }: { shopid?: number } = req.query;

		const isShop = await findShop(shopid);

		if (!isShop) return handleBadRequest(res, 400, 'shop not found');

		const payments_method = [
			{ name: 'Coinbase', active: isShop.coin_base_key ? true : false },
			{ name: 'Stripe', active: isShop.stripe_key ? true : false },
			{ name: 'Paypal', active: false },
			{ name: 'CashApp', active: false },
		];

		return handleSuccess(res, payments_method, '', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const disconnectPayment = async (req: Request, res: Response) => {
	try {
		const { shopid, payment }: { shopid?: number; payment?: PAYMENT_TYPE } = req.query;

		const isShop = await findShop(shopid);

		if (!isShop) return handleBadRequest(res, 400, 'shop not found');

		switch (payment) {
			case 'Coinbase':
				isShop.coin_base_key = null;
				break;
			case 'Stripe':
				isShop.stripe_key = null;
				break;
			// Add more cases if needed
			default:
				// Optional: handle unknown payment methods
				throw new Error(`Unsupported payment method: ${payment}`);
		}

		await isShop.save();

		const payments_method = [
			{ name: 'Coinbase', active: isShop.coin_base_key ? true : false },
			{ name: 'Stripe', active: isShop.stripe_key ? true : false },
			{ name: 'Paypal', active: false },
			{ name: 'CashApp', active: false },
		];

		return handleSuccess(
			res,
			payments_method,
			`${payment} successfully disconnected`,
			200,
			undefined
		);
	} catch (error) {
		return handleError(res, error);
	}
};

export const connectPayment = async (req: Request, res: Response) => {
	try {
		const { shopid, payment, key }: { shopid: number; payment: PAYMENT_TYPE; key: string } =
			req.body;

		if (!payment || !key) return handleBadRequest(res, 400, 'payment or key is required');

		const shop_data = await findShop(shopid);

		if (!shop_data) return handleBadRequest(res, 400, 'shop not found');

		switch (payment) {
			case 'Coinbase':
				shop_data.coin_base_key = key;
				break;
			case 'Stripe':
				shop_data.stripe_key = key;
				break;
			// Add more cases if needed
			default:
				// Optional: handle unknown payment methods
				throw new Error(`Unsupported payment method: ${payment}`);
		}

		await shop_data.save();

		return handleSuccess(res, {}, `${payment} successfully connected`, 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};
