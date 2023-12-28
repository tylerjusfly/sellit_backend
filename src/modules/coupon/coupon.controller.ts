import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth';
import { checkCouponCode, createCoupon, deleteCoupon, fetchCoupons } from './coupon.service';

const couponRouter = Router();

couponRouter.post('/', verifyToken, createCoupon);
couponRouter.get('/check', checkCouponCode);
couponRouter.get('/', fetchCoupons);
couponRouter.delete('/', verifyToken, deleteCoupon);

export const CouponController = { router: couponRouter };
