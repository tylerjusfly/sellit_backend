import type { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler.js';
import type { ICoupon, IeditCoupon } from '../../interfaces/coupon.js';
import { Coupon } from '../../database/entites/coupon.entity.js';
import { dataSource } from '../../database/dataSource.js';
import { Store } from '../../database/entites/store.entity.js';
import type { IPaginate } from '../../interfaces/pagination.js';
import type { CustomRequest } from '../../middlewares/verifyauth.js';
import type { ITokenPayload } from '../../utils/token-helper.js';
import { Product } from '../../database/entites/product.entity.js';
import { calculateDiscountedCost } from '../../utils/order-helpers.js';

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
		const { coupon_code, type, coupon_value, max_use, payment_method }: ICoupon = req.body;

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
			payment_method: payment_method ? payment_method : null,
			total_usage: 0,
		});

		const result = await couponToCreate.save();

		return handleSuccess(res, {}, 'created coupon', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const fetchCoupons = async (req: CustomRequest, res: Response) => {
	try {
		const { page, limit }: { page?: number; limit?: number } = req.query;

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

export const editCoupon = async (req: CustomRequest, res: Response) => {
	try {
		const { coupon_value, max_use, id, type, payment_method, product_id }: IeditCoupon = req.body;

		// Find coupon
		const foundCoupon = await Coupon.findOneBy({ id });

		if (!foundCoupon) {
			return handleBadRequest(res, 404, 'coupon not found');
		}

		if (coupon_value) {
			foundCoupon.coupon_value = +coupon_value;
		}

		if (payment_method && payment_method !== '') {
			foundCoupon.payment_method = payment_method;
		}

		if (product_id && product_id !== '') {
			foundCoupon.product_id = product_id;
		}

		if (max_use && max_use > 0) {
			foundCoupon.max_use = +max_use;
		}

		if (type !== foundCoupon.type) {
			foundCoupon.type = type;
		}

		const user = req.user as ITokenPayload;

		foundCoupon.lastChanged_by = user.storename;

		await foundCoupon.save();

		return handleSuccess(res, foundCoupon, 'updated coupon', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const checkCouponCode = async (req: Request, res: Response) => {
	try {
		const { store_id, coupon_code, product_id, payment_gateway, quantity } = req.body;

		if (!store_id || !coupon_code || !product_id || !quantity) {
			return handleBadRequest(res, 400, 'Please provide all required fields.');
		}

		// find if code exist
		const couponCode = await Coupon.findOne({
			where: {
				shop_id: store_id,
				coupon_code: coupon_code,
			},
		});

		const product = await Product.findOne({
			where: {
				id: product_id,
			},
		});

		if (!couponCode) {
			return handleBadRequest(res, 400, 'This Coupon Is Not Valid.');
		}

		if (!product) {
			return handleBadRequest(res, 400, 'This product does not exist');
		}

		if (couponCode.max_use <= couponCode.total_usage) {
			return handleBadRequest(
				res,
				400,
				'Sorry, this coupon has already been used the maximum number of times.'
			);
		}

		// Check for if product

		if (couponCode.payment_method && couponCode.payment_method !== payment_gateway) {
			return handleBadRequest(
				res,
				400,
				`Sorry, this coupon is only valid for ${couponCode.payment_method} payment.`
			);
		}

		// Calculating coupon rate
		let newCost = 0;

		if (couponCode.type === 'percent') {
			const new_amount = quantity * product.amount;

			let discountRate = (couponCode.coupon_value / 100).toFixed(2); //discount rate
			const discountedPrice = new_amount - new_amount * parseFloat(discountRate);

			newCost = discountedPrice;
			// newCost = calculateDiscountedCost(productCost, couponDiscount);
		}

		if (couponCode.type === 'fixed') {
			const productCost = quantity * product.amount;
			newCost = productCost - +couponCode.coupon_value;
		}

		// Calculate new cost

		return handleSuccess(
			res,
			{
				new_cost: newCost,
				id: couponCode.id,
				couponval:
					couponCode.type === 'percent'
						? `${couponCode.coupon_value}%`
						: `$${couponCode.coupon_value.toFixed(2)}`,
			},
			'',
			201,
			undefined
		);
	} catch (error) {
		return handleError(res, error);
	}
};
