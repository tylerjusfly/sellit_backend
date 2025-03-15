import { NextFunction, Request, Response } from 'express';
import { Product } from '../database/entites/product.entity';
import { dataSource } from '../database/dataSource';
import { handleBadRequest } from '../constants/response-handler';
import { IEditProduct } from '../interfaces/product';

export const checkPaymentTypeVlidity = async (req: Request, res: Response, next: NextFunction) => {
	const { id, cashapp, crypto, paypal, stripe }: IEditProduct = req.body;

	const product_data = await dataSource.getRepository(Product).findOne({
		where: {
			id,
		},
	});

	if (!product_data) {
		return handleBadRequest(res, 404, 'product does not exist');
	}

	// Check if payment in request is true and check the validity
	if (crypto && !product_data.shop_id.coinbase_key) {
		return handleBadRequest(res, 404, 'Gateway coinbase is not configured for shop');
	}

	if (stripe && !product_data.shop_id.stripe_key) {
		return handleBadRequest(res, 404, 'Gateway stripe is not configured for store');
	}

	if (cashapp) {
		return handleBadRequest(res, 404, 'Gateway cashapp is not configured for shop');
	}

	if (paypal) {
		return handleBadRequest(res, 404, 'Gateway paypal is not configured for shop');
	}

	// else continue
	next();
};
