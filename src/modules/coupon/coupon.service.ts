import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { ICoupon } from '../../interfaces/coupon';
import { Coupon } from '../../database/entites/coupon.entity';
import { dataSource } from '../../database/dataSource';
import { Shop } from '../../database/entites/shop.entity';

export const createCoupon = async (req: Request, res: Response) => {
	try {
		const { shopid, coupon_code, discount }: ICoupon = req.body;
		if (!shopid || !coupon_code || !discount) {
			return handleBadRequest(res, 400, 'all fields are required');
		}

		const isShop = await dataSource
			.getRepository(Shop)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shopid })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		const couponToCreate = dataSource.getRepository(Coupon).create({
			shop_id: shopid,
			coupon_code,
			discount,
		});

		// const result = await dataSource.getRepository(Coupon).save(couponToCreate);
		const result = await couponToCreate.save();

		return handleSuccess(res, result, 'created product', 201, undefined);
	} catch (error) {
		handleError(res, error);
	}
};
