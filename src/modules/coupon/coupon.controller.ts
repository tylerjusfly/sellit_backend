import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth.js';
import {
	checkCouponCode,
	createCoupon,
	editCoupon,
	fetchCoupons,
	fetchSingleCoupon,
} from './coupon.service.js';
import { authorize } from '../../middlewares/confirm-permission.js';
import { deleteMiddleware } from '../../middlewares/delete-item.js';
import { Coupon } from '../../database/entites/coupon.entity.js';
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
couponRouter.get('/', verifyToken, fetchCoupons);
couponRouter.patch('/', verifyToken, authorize(['coupon:create']), editCoupon);
couponRouter.get('/one', verifyToken, fetchSingleCoupon);
couponRouter.delete('/', verifyToken, deleteMiddleware(Coupon, false));

/**Public API */
couponRouter.post('/check', checkCouponCode);

export const CouponController = { router: couponRouter };
