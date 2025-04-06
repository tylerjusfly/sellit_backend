import { Router } from 'express';
import { AuthController } from './auth/auth.controller';
// import { ShopController } from './shop/shop.controller';
import { ProductController } from './product/product.controller';
import { CategoriesController } from './categories/categories.controller';
import { paymentSettingsController } from './payment-settings/payment.controller';
import { OrderController } from './order/order.controller';
import { CoinbaseController } from './coinbase/coinbase.controller';
import { StripeController } from './stripe/stripe.controller';
import { StoreController } from './store/store.controller';
import { CustomizationController } from './customization/customization.controller';
import { TicketsController } from './tickets/tickets.controller';
import { BlacklistsController } from './blacklist/blacklist.controller';
import { CouponController } from './coupon/coupon.controller';
// import { CouponController } from './coupon/coupon.controller';
// import { BlacklistsController } from './blacklist/blacklist.controller';
// import { TicketsController } from './tickets/tickets.controller';

const router = Router();

router.use('/auth', AuthController.router);
router.use('/product', ProductController.router);
router.use('/categories', CategoriesController.router);
router.use('/payment-settings', paymentSettingsController.router);
router.use('/orders', OrderController.router);
router.use('/coinbase', CoinbaseController.router);
router.use('/stripe', StripeController.router);
router.use('/store', StoreController.router);
router.use('/customization', CustomizationController.router);
router.use('/blacklists', BlacklistsController.router);
router.use('/coupons', CouponController.router);
// router.use('/tickets', TicketsController.router);
// router.use('/queue', QueueRouter.router);

export const apiRouter = router;
