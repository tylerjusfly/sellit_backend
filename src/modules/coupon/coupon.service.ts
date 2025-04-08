import type { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler.js';
import type { ICoupon, IeditCoupon } from '../../interfaces/coupon.js';
import { Coupon } from '../../database/entites/coupon.entity.js';
import { dataSource } from '../../database/dataSource.js';
import { Store } from '../../database/entites/store.entity.js';
import type { IPaginate } from '../../interfaces/pagination.js';
import type { CustomRequest } from '../../middlewares/verifyauth.js';
import type { ITokenPayload } from '../../utils/token-helper.js';

const isCouponCodeUnique = async (shopId: string, couponCode: string): Promise<boolean> => {
	const existingCoupon = await dataSource
		.getRepository(Coupon)
		.createQueryBuilder('coupon')
		.where('coupon.shop_id = :shopId', { shopId })
		.andWhere('coupon.coupon_code = :couponCode', { couponCode })
		.getOne();

	return !existingCoupon;
};

export const createCoupon = async (req: CustomRequest, res: Response) => {
	try {
		const { coupon_code, type, coupon_value, max_use }: ICoupon = req.body;

		const shop = req.user as ITokenPayload;

		const isShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shop.id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		//check if coupon code already exist
		const isUnique = await isCouponCodeUnique(shop.id, coupon_code);

		if (!isUnique) {
			return handleBadRequest(res, 400, 'you already created this coupon code');
		}

		const couponToCreate = dataSource.getRepository(Coupon).create({
			shop_id: shop.id,
			coupon_code: coupon_code,
			coupon_value: coupon_value,
			type: type,
			max_use,
			total_usage: 0,
		});

		const result = await couponToCreate.save();

		return handleSuccess(res, {}, 'created coupon', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const checkCouponCode = async (req: Request, res: Response) => {
	try {
		const { shopid, code }: { shopid?: string; code?: string } = req.query;

		if (!code || !shopid) {
			return handleBadRequest(res, 400, 'coupon code /shop id is required');
		}

		// find if code exist
		const couponCode = await Coupon.findOne({
			where: {
				shop_id: shopid,
				coupon_code: code,
			},
		});

		if (!couponCode) {
			return res.status(200).json({ status: false });
		}

		if (couponCode.max_use <= couponCode.total_usage) {
			return res.status(200).json({ status: false });
		}

		// else coupon is valid
		return res.status(200).json({ status: true, discount: couponCode.coupon_value });
	} catch (error) {
		return handleError(res, error);
	}
};

export const fetchCoupons = async (req: CustomRequest, res: Response) => {
	try {
		const { page, limit }: { shop_id?: string; page?: number; limit?: number } = req.query;

		const shop_id = req.user as ITokenPayload;

		const page_limit = limit ? Number(limit) : 10;

		const offset = page ? (Number(page) - 1) * page_limit : 0;

		const isShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shop_id.id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		const [Coupons, total] = await Coupon.findAndCount({
			where: {
				shop_id: shop_id.id,
			},
			skip: offset,
			take: page_limit,
			order: { created_at: 'DESC' },
		});

		const paging: IPaginate = {
			totalItems: total,
			currentPage: page ? Number(page) : 1,
			totalpages: Math.ceil(total / page_limit),
			itemsPerPage: page_limit,
		};

		return handleSuccess(res, Coupons, `coupons`, 200, paging);
	} catch (error) {
		return handleError(res, error);
	}
};

export const fetchSingleCoupon = async (req: Request, res: Response) => {
	try {
		const { shop_id, code }: { shop_id?: string; code?: string } = req.query;

		if (!shop_id || !code) {
			return handleBadRequest(res, 400, 'shop/code is required');
		}

		const foundCoupon = await Coupon.findOne({
			where: {
				coupon_code: code,
				shop_id: shop_id,
			},
		});

		if (!foundCoupon) {
			return handleBadRequest(res, 404, 'coupon not found');
		}

		return handleSuccess(res, foundCoupon, `coupons`, 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const editCoupon = async (req: CustomRequest, res: Response) => {
	try {
		const { id }: { id?: string } = req.query;

		const { discount, max_use, items }: IeditCoupon = req.body;

		// Find coupon
		const foundCoupon = await Coupon.findOneBy({ id });

		if (!foundCoupon) {
			return handleBadRequest(res, 404, 'coupon not found');
		}

		// if (discount && discount !== '') {
		// 	foundCoupon.discount = +discount;
		// }

		// if (max_use && max_use !== '') {
		// 	foundCoupon.max_use = +max_use;
		// }

		// if (items) {
		// 	foundCoupon.items = items;
		// }

		const user = req.user as ITokenPayload;

		foundCoupon.lastChanged_by = user.storename;

		await foundCoupon.save();

		return handleSuccess(res, foundCoupon, 'updated coupon', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const couponApplyToProduct = async (req: Request, res: Response) => {
	try {
		const { shopid, code, productid }: { shopid?: string; code?: string; productid?: string } =
			req.query;

		if (!code || !shopid || !productid) {
			return handleBadRequest(res, 400, 'coupon code /shop id is required');
		}

		// find if code exist
		const couponCode = await Coupon.findOne({
			where: {
				shop_id: shopid,
				coupon_code: code,
			},
		});

		if (!couponCode) {
			return res.status(200).json({ status: false });
		}

		if (couponCode.max_use >= couponCode.total_usage) {
			return res.status(200).json({ status: false });
		}

		// if (!couponCode.items.includes(productid)) {
		// 	return res.status(200).json({ status: false });
		// }

		// else coupon is valid
		return res.status(200).json({ status: true });
	} catch (error) {
		return handleError(res, error);
	}
};
