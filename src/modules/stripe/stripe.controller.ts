import { Router } from 'express';
import { cashappChargeForVendors, stripeChargeForVendors, stripeSuccess } from './stripe.service';

const stripebaseRouter = Router();

// productRouter.get('/', verifyToken, getAllProductByShop);

// Public routes
stripebaseRouter.post('/vendor/payment', stripeChargeForVendors);
stripebaseRouter.post('/cashapp/vendor/payment', cashappChargeForVendors);
stripebaseRouter.get('/successful/:orderid/:shop', stripeSuccess);
// productRouter.get('/cart-product', getOneProduct);

export const StripeController = { router: stripebaseRouter };
