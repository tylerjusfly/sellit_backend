import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import Stripe from 'stripe';
import { dataSource } from '../../database/dataSource';
import { Orders } from '../../database/entites/orders.entity';
import { ENV } from '../../constants/env-variables';
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
				orderid: orderid,
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
							name: `${isOrder?.product_name || 'unknown product from shop'}`,
						},
						unit_amount: isOrder.total_amount * 100,
					},
					quantity: 1,
				},
			],
			mode: 'payment',
			success_url: `${origin}/stripe/successful/${isOrder.orderid}/${isOrder.shop_slug}`,
			cancel_url: `${ENV.FRONTEND_URL}/store/${isOrder.shop_slug}`,
		});

		res.json({ success: true, url: session.url });
	} catch (error) {
		return handleError(res, error);
	}
};

export const stripeSuccess = async (req: Request, res: Response) => {
	const { orderid, shop }: { orderid?: string; shop?: string } = req.params;

	return handleSuccess(res, { orderid, shop }, '', 200, undefined);
};
