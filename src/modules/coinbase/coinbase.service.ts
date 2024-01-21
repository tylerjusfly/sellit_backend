import { Response, Request } from 'express';
// import fetch from 'node:http'
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { ICreateCoinbase } from '../../interfaces/payment.interface';

export const coinBaseChargeForVendors = async (req: Request, res: Response) => {
	try {
		const { shop, orderid }: ICreateCoinbase = req.body;

		if (!shop || !orderid) {
			return handleBadRequest(res, 400, 'all field is required');
		}

		// getting host address to route for success
		const origin = `${req.secure ? 'https://' : 'http://'}${req.headers.host}`;

		const url = 'https://api.commerce.coinbase.com/charges';

		// Fetch shop
		// const shopCoinbase_key = "SELECT coinbaseKey FROM shops WHERE name = ?";
		const shopCoinbase_key = '';

		// fetch orderId
		const isOrder = {
			totalAmount: 2000,
			product_name: '',
		};

		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'X-CC-Api-Key': shopCoinbase_key,
				'X-CC-Api-Version': ' 2018-03-22',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				local_price: { amount: isOrder.totalAmount, currency: 'USD' },
				name: isOrder.product_name,
				pricing_type: 'fixed_price',
				redirect_url: `${origin}/api/v1/coinbase/success/${orderid}/${shop}`,
				cancel_url: `http://localhost:3000/store/${shop}`,
				description: `payment for ${isOrder.product_name} to ${shop} `,
			}),
		};

		// return handleSuccess(res, options, '', 201, undefined);

		// Send request
		fetch(url, options)
			.then((result) => result.json())
			.then((jsondata) => {
				console.log(jsondata);
				if (jsondata.error) {
					return handleError(res, jsondata.error);
				} else {
					res.json({
						success: true,
						url: jsondata.data?.hosted_url,
					});
				}
			})
			.catch((err) => {
				console.error('errorme:' + err);

				return handleError(res, err);
			});
	} catch (error) {
		return handleError(res, error);
	}
};
