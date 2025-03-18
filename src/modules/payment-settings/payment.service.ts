import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { getStoreByStoreId } from '../store/storehelpers';

type PAYMENT_TYPE = 'coinbase' | 'stripe' | 'paypal' | 'cashApp';

export const fetchShopPayments = async (req: Request, res: Response) => {
	try {
		const { shopid }: { shopid?: string } = req.query;

		const isShop = await getStoreByStoreId(shopid as string);

		if (!isShop) return handleBadRequest(res, 400, 'shop not found');

		const payments_method = {
			coinbase: { name: 'Coinbase', active: isShop.coinbase_key ? true : false },
			stripe: { name: 'Stripe', active: isShop.stripe_key ? true : false },
			paypal: { name: 'Paypal', active: false },
			cashapp: { name: 'CashApp', active: false },
		};

		return handleSuccess(res, payments_method, '', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const disconnectPayment = async (req: Request, res: Response) => {
	try {
		const { shopid, payment }: { shopid: string; payment: PAYMENT_TYPE } = req.body;

		const isShop = await getStoreByStoreId(shopid);

		if (!isShop) return handleBadRequest(res, 400, 'shop not found');

		switch (payment.toLowerCase()) {
			case 'coinbase':
				isShop.coinbase_key = null;
				break;
			case 'stripe':
				isShop.stripe_key = null;
				break;
			// Add more cases if needed
			default:
				// Optional: handle unknown payment methods
				throw new Error(`Unsupported payment method: ${payment}`);
		}

		await isShop.save();

		const payments_method = [
			{ name: 'Coinbase', active: isShop.coinbase_key ? true : false },
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
		const { shopid, payment, key }: { shopid: string; payment: PAYMENT_TYPE; key: string } =
			req.body;

		if (!payment || !key) return handleBadRequest(res, 400, 'payment or key is required');

		const shop_data = await getStoreByStoreId(shopid);

		if (!shop_data) return handleBadRequest(res, 400, 'shop not found');

		switch (payment.toLowerCase()) {
			case 'coinbase':
				shop_data.coinbase_key = key;
				break;
			case 'stripe':
				shop_data.stripe_key = key;
				break;
			// Add more cases if needed
			default:
				// Optional: handle unknown payment methods
				throw new Error(`Unsupported payment method: ${payment}`);
		}

		await shop_data.save();

		// const payments_method = {
		// 	coinbase: { name: 'Coinbase', active: shop_data.coinbase_key ? true : false },
		// 	stripe: { name: 'Stripe', active: shop_data.stripe_key ? true : false },
		// 	paypal: { name: 'Paypal', active: false },
		// 	cashapp: { name: 'CashApp', active: false },
		// };

		return handleSuccess(res, {}, `${payment} successfully connected`, 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};
