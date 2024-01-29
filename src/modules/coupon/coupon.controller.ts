import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth';
import {
	checkCouponCode,
	createCoupon,
	deleteCoupon,
	editCoupon,
	fetchCoupons,
	fetchSingleCoupon,
} from './coupon.service';
// import { rateLimiter } from '../../middlewares/rate-limiter';

const couponRouter = Router();

couponRouter.post('/', verifyToken, createCoupon);
couponRouter.get('/check', checkCouponCode);
couponRouter.get('/', verifyToken, fetchCoupons);
couponRouter.patch('/', verifyToken,  editCoupon);
couponRouter.get('/one', verifyToken,  fetchSingleCoupon);
couponRouter.delete('/', verifyToken, deleteCoupon);

export const CouponController = { router: couponRouter };
