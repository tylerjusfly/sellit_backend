import { Router } from 'express';
import { AuthController } from './auth/auth.controller';
import { ShopController } from './shop/shop.controller';
import { ProductController } from './product/product.controller';
import { CouponController } from './coupon/coupon.controller';
import { CategoriesController } from './categories/categories.controller';
import { CoinbaseController } from './coinbase/coinbase.controller';
import { OrderController } from './order/order.controller';

const router = Router();

router.use('/auth', AuthController.router);
router.use('/shops', ShopController.router);
router.use('/product', ProductController.router);
router.use('/coupon', CouponController.router);
router.use('/categories', CategoriesController.router);
router.use('/coinbase', CoinbaseController.router);
router.use('/order', OrderController.router);
// router.use('/queue', QueueRouter.router);

export const apiRouter = router;
