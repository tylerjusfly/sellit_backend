import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { ICoupon } from '../../interfaces/coupon';
import { Coupon } from '../../database/entites/coupon.entity';
import { dataSource } from '../../database/dataSource';
import { Shop } from '../../database/entites/shop.entity';
import { IPaginate } from '../../interfaces/pagination';

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
		handleError(res, error);
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

		if (couponCode.max_use === couponCode.total_usage) {
			return res.status(200).json({ status: false });
		}

		// else coupon is valid
		return res.status(200).json({ status: true });
	} catch (error) {
		handleError(res, error);
	}
};

export const fetchCoupons = async (req: Request, res: Response) => {
	try {
		const { shop_id, page, limit }: { shop_id?: string; page?: number; limit?: number } = req.query;

		const page_limit = limit ? Number(limit) : 10;

		const offset = page ? (Number(page) - 1) * page_limit : 0;

		const isShop = await dataSource
			.getRepository(Shop)
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
		handleError(res, error);
	}
};

export const deleteCoupon = async (req: Request, res: Response) => {
	try {
		const { uuid }: { uuid?: number } = req.query;

		if (!uuid) {
			return handleBadRequest(res, 400, 'shop id is required');
		}

		const isShop = await dataSource.getRepository(Coupon).findOne({
			where: { id: uuid },
		});

		if (!isShop) return handleBadRequest(res, 400, 'cannot delete unexisting coupon');

		await isShop.softRemove();

		return handleSuccess(res, null, 'coupon dropped', 200, undefined);
	} catch (error) {
		handleError(res, error);
	}
};
