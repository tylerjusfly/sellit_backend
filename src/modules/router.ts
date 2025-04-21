import { Router } from 'express';
import { AuthController } from './auth/auth.controller.js';
// import { ShopController } from './shop/shop.controller';
import { ProductController } from './product/product.controller.js';
import { CategoriesController } from './categories/categories.controller.js';
import { paymentSettingsController } from './payment-settings/payment.controller.js';
import { OrderController } from './order/order.controller.js';
import { CoinbaseController } from './coinbase/coinbase.controller.js';
import { StripeController } from './stripe/stripe.controller.js';
import { StoreController } from './store/store.controller.js';
import { CustomizationController } from './customization/customization.controller.js';
import { TicketsController } from './tickets/tickets.controller.js';
import { BlacklistsController } from './blacklist/blacklist.controller.js';
import { CouponController } from './coupon/coupon.controller.js';
import { AnalyticsController } from './analytics/analytics.controller.js';
// import { CouponController } from './coupon/coupon.controller';
// import { BlacklistsController } from './blacklist/blacklist.controller';

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
router.use('/analytics', AnalyticsController.router);
router.use('/tickets', TicketsController.router);
// router.use('/queue', QueueRouter.router);

export const apiRouter = router;
