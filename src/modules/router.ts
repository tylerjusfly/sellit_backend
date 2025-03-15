import { Router } from 'express';
import { AuthController } from './auth/auth.controller';
// import { ShopController } from './shop/shop.controller';
import { ProductController } from './product/product.controller';
import { CategoriesController } from './categories/categories.controller';
import { paymentSettingsController } from './payment-settings/payment.controller';
import { OrderController } from './order/order.controller';
import { CoinbaseController } from './coinbase/coinbase.controller';
// import { CouponController } from './coupon/coupon.controller';
// import { StripeController } from './stripe/stripe.controller';
// import { BlacklistsController } from './blacklist/blacklist.controller';
// import { TicketsController } from './tickets/tickets.controller';

const router = Router();

router.use('/auth', AuthController.router);
router.use('/product', ProductController.router);
router.use('/categories', CategoriesController.router);
router.use('/payment-settings', paymentSettingsController.router);
router.use('/orders', OrderController.router);
router.use('/coinbase', CoinbaseController.router);
// router.use('/coupon', CouponController.router);
// router.use('/stripe', StripeController.router);
// router.use('/blacklist', BlacklistsController.router);
// router.use('/ticket', TicketsController.router);
// router.use('/queue', QueueRouter.router);

export const apiRouter = router;
