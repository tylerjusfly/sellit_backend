import { Response, Request } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { ICreateCoinbase } from '../../interfaces/payment.interface';
import { dataSource } from '../../database/dataSource';
import { Orders } from '../../database/entites/orders.entity';
import { ENV } from '../../constants/env-variables';

export const coinBaseChargeForVendors = async (req: Request, res: Response) => {
	try {
		const { orderid }: ICreateCoinbase = req.body;

		if (!orderid) {
			return handleBadRequest(res, 400, 'all field is required');
		}

		// getting host address to route for success
		const origin = `${req.secure ? 'https://' : 'http://'}${req.headers.host}`;

		const url = 'https://api.commerce.coinbase.com/charges';

		// Fetch shop
		const isOrder = await dataSource.getRepository(Orders).findOne({
			where: {
				orderid: orderid,
			},
			loadEagerRelations: true,
		});

		if (!isOrder) {
			return handleBadRequest(res, 400, 'order does not exist');
		}

		const shop = isOrder.shop_id;

		// const shopCoinbase_key = shop.stripe_key;

		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'X-CC-Api-Key': ENV.COINBASE_KEY || '',
				'X-CC-Api-Version': ' 2018-03-22',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				local_price: { amount: isOrder.total_amount, currency: 'USD' },
				name: isOrder.product_name,
				pricing_type: 'fixed_price',
				redirect_url: `${origin}/coinbase/success/${orderid}/${shop.name}`,
				cancel_url: `${ENV.FRONTEND_URL}/${shop.name}`,
				description: `payment for ${isOrder.product_name} to ${shop.name} `,
				// logo_url:'',
			}),
		};

		// Send request
		fetch(url, options)
			.then((result) => result.json())
			.then((jsondata) => {
				if (jsondata.error) {
					return handleError(res, jsondata.error);
				} else {
					res.json({
						success: true,
						url: jsondata.data?.hosted_url,
						// url: 'http://localhost:3000/store/kfc/',
					});
				}
			})
			.catch((err) => {
				// console.error('errorme:' + err);

				return handleError(res, err);
			});
	} catch (error) {
		return handleError(res, error);
	}
};

export const coinbaseSuccess = async (req: Request, res: Response) => {
	try {
		const { orderid, shop }: { orderid?: string; shop?: string } = req.params;

		return handleSuccess(res, { orderid, shop }, '', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};
