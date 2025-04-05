import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import Stripe from 'stripe';
import { dataSource } from '../../database/dataSource';
import { Orders } from '../../database/entites/orders.entity';
import { ENV } from '../../constants/env-variables';
import { manipulateOrderItem } from '../../utils/order-helpers';
import { sendOrderMail } from '../../mail-providers/sendordermail';
const stripe = new Stripe(ENV.STRIPE_SECRET_KEY || '');

export const stripeChargeForVendors = async (req: Request, res: Response) => {
	try {
		const { orderid }: { orderid: string } = req.body;

		if (!orderid) {
			return handleBadRequest(res, 400, 'orderid is required');
		}

		const origin = `${req.secure ? 'https://' : 'http://'}${req.headers.host}`;

		// First check for orderid
		const isOrder = await dataSource.getRepository(Orders).findOne({
			where: {
				id: orderid,
			},
			loadEagerRelations: true,
		});

		if (!isOrder) {
			return handleBadRequest(res, 400, 'order does not exist');
		}

		const StripeKeyFromStore = isOrder.shop_id.stripe_key;

		if (!StripeKeyFromStore) {
			return handleBadRequest(
				res,
				400,
				'stripe payment is no longer available for this product. Contact Store Support'
			);
		}

		const stripeCharge = new Stripe(StripeKeyFromStore || '');

		if (!stripeCharge) {
			return handleBadRequest(res, 400, 'unable to create stripe payment');
		}

		const session = await stripeCharge.checkout.sessions.create({
			customer_email: isOrder.order_from,
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: `${
								isOrder?.productid.name || `unknown product from ${isOrder.shop_id.storename} `
							}`,
						},
						unit_amount: isOrder.total_amount * 100,
					},
					quantity: 1,
				},
			],
			payment_method_types: ['card'],
			mode: 'payment',
			metadata: {
				userEmail: isOrder.order_from,
			},
			success_url: `${origin}/stripe/successful/${isOrder.id}/${isOrder.shop_id.storename}`,
			cancel_url: `${ENV.FRONTEND_URL}/orders/${orderid}`,
		});

		return handleSuccess(res, { url: session.url }, 'created', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const cashappChargeForVendors = async (req: Request, res: Response) => {
	try {
		const { orderid }: { orderid: string } = req.body;

		if (!orderid) {
			return handleBadRequest(res, 400, 'orderid is required');
		}

		const origin = `${req.secure ? 'https://' : 'http://'}${req.headers.host}`;

		// First check for orderid
		const isOrder = await dataSource.getRepository(Orders).findOne({
			where: {
				id: orderid,
			},
			loadEagerRelations: true,
		});

		if (!isOrder) {
			return handleBadRequest(res, 400, 'order does not exist');
		}

		if (!stripe) {
			return handleBadRequest(res, 400, 'unable to create stripe payment');
		}

		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: `${isOrder?.productid.name || 'unknown product from shop'}`,
						},
						unit_amount: isOrder.total_amount * 100,
					},
					quantity: 1,
				},
			],
			payment_method_types: ['cashapp'],
			mode: 'payment',
			success_url: `${origin}/stripe/successful/${isOrder.id}/${isOrder.shop_id.storename}`,
			cancel_url: `${ENV.FRONTEND_URL}/orders/${orderid}`,
		});

		return handleSuccess(res, { url: session.url }, 'created', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

// "affirm", "alipay", "card", "cashapp", "klarna", "link", "wechat_pay"],

export const stripeSuccess = async (req: Request, res: Response) => {
	const { orderid }: { orderid?: string } = req.params;

	try {
		if (!orderid) {
			return res.redirect(`${ENV.FRONTEND_URL}`);
		}

		const isOrder = await dataSource.getRepository(Orders).findOne({
			where: {
				id: orderid,
			},
			loadEagerRelations: true,
		});

		if (!isOrder) {
			return res.redirect(`${ENV.FRONTEND_URL}`);
		}

		/**Change order */

		const manipulate_result = await manipulateOrderItem(isOrder.id, isOrder.productid.id);

		// if (!manipulate_result) {
		// 	return handleBadRequest(res, 400, 'failed to approve order');
		// }

		// Send email to user about order
		// await sendOrderMail(isOrder.id);

		return res.redirect(`${ENV.FRONTEND_URL}/orders/${orderid}`);
	} catch (error) {
		return res.redirect(`${ENV.FRONTEND_URL}/orders/${orderid}`);
	}
};

export const onBoardStripeUsers = async (req: Request, res: Response) => {
	const { shopname } = req.body;

	if (!shopname) {
		return handleBadRequest(res, 404, 'shopname Field is required');
	}
	try {
		if (!stripe) {
			return handleBadRequest(res, 404, 'internal stripe error');
		}

		const account = await stripe.accounts.create({ type: 'standard' });

		// setting account Id to session
		req.params.shopName = shopname;
		req.params.accountID = account.id;
		res.redirect(`/api/v1/onboard-user/refresh/${req.params.shopName}/${req.params.accountID}`);
	} catch (error) {
		console.log(error);
		return handleError(res, error);
	}
};