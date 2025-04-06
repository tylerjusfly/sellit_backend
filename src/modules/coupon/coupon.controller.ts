import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth.js';
import {
	checkCouponCode,
	couponApplyToProduct,
	createCoupon,
	editCoupon,
	fetchCoupons,
	fetchSingleCoupon,
} from './coupon.service.js';
import { authorize } from '../../middlewares/confirm-permission.js';
import { deleteMiddleware } from '../../middlewares/delete-item.js';
import { Coupon } from '../../database/entites/coupon.entity.js';
import { createFetchMiddleware } from '../../middlewares/fetch-all-paginated.js';
import { couponSchema } from './coupon.validation.js';
import { validateRequest } from '../../middlewares/validate-body.js';

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
