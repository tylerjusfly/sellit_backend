import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { ICoupon, IeditCoupon } from '../../interfaces/coupon';
import { Coupon } from '../../database/entites/coupon.entity';
import { dataSource } from '../../database/dataSource';
import { Store } from '../../database/entites/store.entity';
import { IPaginate } from '../../interfaces/pagination';
import { CustomRequest } from '../../middlewares/verifyauth';
import { ITokenPayload } from '../../utils/token-helper';

const isCouponCodeUnique = async (shopId: string, couponCode: string): Promise<boolean> => {
	const existingCoupon = await dataSource
		.getRepository(Coupon)
		.createQueryBuilder('coupon')
		.where('coupon.shop_id = :shopId', { shopId })
		.andWhere('coupon.coupon_code = :couponCode', { couponCode })
		.getOne();

	return !existingCoupon;
};

export const createCoupon = async (req: Request, res: Response) => {
	try {
		const { shopid, coupon_code }: ICoupon = req.body;

		let { discount } = req.body;

		if (!shopid || !coupon_code) {
			return handleBadRequest(res, 400, 'all fields are required');
		}

		if (!discount) {
			discount = 0;
		}

		const isShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shopid })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		//check if coupon code already exist
		const isUnique = await isCouponCodeUnique(shopid, coupon_code);

		if (!isUnique) {
			return handleBadRequest(res, 400, 'you already created this coupon code');
		}

		const couponToCreate = dataSource.getRepository(Coupon).create({
			shop_id: shopid,
			coupon_code,
			discount,
		});

		const result = await couponToCreate.save();

		return handleSuccess(res, result, 'created coupon', 201, undefined);
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
		return res.status(200).json({ status: true, discount: couponCode.discount });
	} catch (error) {
		return handleError(res, error);
	}
};

export const fetchCoupons = async (req: Request, res: Response) => {
	try {
		const { shop_id, page, limit }: { shop_id?: string; page?: number; limit?: number } = req.query;

		if (!shop_id) {
			return handleBadRequest(res, 400, 'shop is required');
		}

		const page_limit = limit ? Number(limit) : 10;

		const offset = page ? (Number(page) - 1) * page_limit : 0;

		const isShop = await dataSource
			.getRepository(Store)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shop_id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		const [Coupons, total] = await Coupon.findAndCount({
			where: {
				shop_id,
			},
			skip: offset,
			take: page_limit,
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

		if (discount && discount !== '') {
			foundCoupon.discount = +discount;
		}

		if (max_use && max_use !== '') {
			foundCoupon.max_use = +max_use;
		}

		if (items) {
			foundCoupon.items = items;
		}

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

		if (!couponCode.items.includes(productid)) {
			return res.status(200).json({ status: false });
		}

		// else coupon is valid
		return res.status(200).json({ status: true });
	} catch (error) {
		return handleError(res, error);
	}
};
