import { Router } from 'express';
import { AuthController } from './auth/auth.controller';
import { ShopController } from './shop/shop.controller';
import { ProductController } from './product/product.controller';
import { CouponController } from './coupon/coupon.controller';

const router = Router();

router.use('/auth', AuthController.router);
router.use('/shops', ShopController.router);
router.use('/product', ProductController.router);
router.use('/coupon', CouponController.router);
// router.use('/queue', QueueRouter.router);

export const apiRouter = router;
