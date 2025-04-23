import type { NextFunction, Request, Response } from 'express';
import { Product } from '../database/entites/product.entity.js';
import { dataSource } from '../database/dataSource.js';
import { handleBadRequest } from '../constants/response-handler.js';
import type { IEditProduct } from '../interfaces/product.js';

export const checkPaymentTypeVlidity = async (req: Request, res: Response, next: NextFunction) => {
	const { id, cashapp, coinbase_key, paypal, stripe }: IEditProduct = req.body;

	const product_data = await dataSource.getRepository(Product).findOne({
		where: {
			id,
		},
	});

	if (!product_data) {
		return handleBadRequest(res, 404, 'product does not exist');
	}

	// Check if payment in request is true and check the validity
	if (coinbase_key && !product_data.shop_id.coinbase_key) {
		return handleBadRequest(res, 404, 'Gateway coinbase is not configured for shop');
	}

	if (stripe && !product_data.shop_id.stripe_key) {
		return handleBadRequest(res, 404, 'Gateway stripe is not configured for store');
	}

	if (cashapp && !product_data.shop_id.cashapp_tag) {
		return handleBadRequest(res, 404, 'Gateway cashapp is not configured for shop');
	}

	if (paypal) {
		return handleBadRequest(res, 404, 'Gateway paypal is not configured for shop');
	}

	// else continue
	next();
};
