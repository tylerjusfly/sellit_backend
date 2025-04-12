import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth.js';
import { checkCouponCode, createCoupon, editCoupon, fetchCoupons } from './coupon.service.js';
import { authorize } from '../../middlewares/confirm-permission.js';
import { deleteMiddleware } from '../../middlewares/delete-item.js';
import { Coupon } from '../../database/entites/coupon.entity.js';
import { couponSchema, couponSchemaEdit } from './coupon.validation.js';
import { validateRequest } from '../../middlewares/validate-body.js';

const couponRouter = Router();

couponRouter.post(
	'/',
	verifyToken,
	authorize(['coupon:create']),
	validateRequest(couponSchema),
	createCoupon
);
couponRouter.get('/', verifyToken, fetchCoupons);
couponRouter.patch(
	'/',
	verifyToken,
	// authorize(['coupon:create']),
	validateRequest(couponSchemaEdit),
	editCoupon
);
couponRouter.delete('/', verifyToken, deleteMiddleware(Coupon, false));

/**Public API */
couponRouter.post('/check', checkCouponCode);

export const CouponController = { router: couponRouter };
