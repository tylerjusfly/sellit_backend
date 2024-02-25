import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth';
import {
	checkCouponCode,
	couponApplyToProduct,
	createCoupon,
	deleteCoupon,
	editCoupon,
	fetchCoupons,
	fetchSingleCoupon,
} from './coupon.service';
// import { rateLimiter } from '../../middlewares/rate-limiter';

const couponRouter = Router();

couponRouter.post('/', verifyToken, createCoupon);
couponRouter.get('/', verifyToken, fetchCoupons);
couponRouter.patch('/', verifyToken, editCoupon);
couponRouter.get('/one', verifyToken, fetchSingleCoupon);
couponRouter.delete('/', verifyToken, deleteCoupon);

/**Public API */
couponRouter.post('/apply', couponApplyToProduct);
couponRouter.get('/check', checkCouponCode);

export const CouponController = { router: couponRouter };
