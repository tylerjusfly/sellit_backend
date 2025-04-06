import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth';
import {
	checkCouponCode,
	couponApplyToProduct,
	createCoupon,
	editCoupon,
	fetchCoupons,
	fetchSingleCoupon,
} from './coupon.service';
import { authorize } from '../../middlewares/confirm-permission';
import { deleteMiddleware } from '../../middlewares/delete-item';
import { Coupon } from '../../database/entites/coupon.entity';
import { createFetchMiddleware } from '../../middlewares/fetch-all-paginated';
import { couponSchema } from './coupon.validation';
import { validateRequest } from '../../middlewares/validate-body';

const couponRouter = Router();

couponRouter.post(
	'/',
	verifyToken,
	authorize(['product:read']),
	validateRequest(couponSchema),
	createCoupon
);
couponRouter.get('/', verifyToken, createFetchMiddleware(Coupon, 'shop_id'));
couponRouter.patch('/', verifyToken, authorize(['coupon:create']), editCoupon);
couponRouter.get('/one', verifyToken, fetchSingleCoupon);
couponRouter.delete('/', verifyToken, deleteMiddleware(Coupon));

/**Public API */
couponRouter.post('/apply', couponApplyToProduct);
couponRouter.get('/check', checkCouponCode);

export const CouponController = { router: couponRouter };
