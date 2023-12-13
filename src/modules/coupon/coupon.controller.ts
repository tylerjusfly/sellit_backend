import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth';
import { checkCouponCode, createCoupon, fetchCoupons } from './coupon.service';

const couponRouter = Router();

couponRouter.post('/', verifyToken, createCoupon);
couponRouter.get('/check', checkCouponCode);
couponRouter.get('/', fetchCoupons);

export const CouponController = { router: couponRouter };
