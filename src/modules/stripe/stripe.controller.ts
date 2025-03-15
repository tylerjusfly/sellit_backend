import { Router } from 'express';
import {
	cashappChargeForVendors,
	onBoardStripeUsers,
	stripeChargeForVendors,
	stripeSuccess,
} from './stripe.service';
import { verifyToken } from '../../middlewares/verifyauth';

const stripebaseRouter = Router();

stripebaseRouter.post('/api/vendor/stripe/onboard', verifyToken, onBoardStripeUsers);

// Public routes
stripebaseRouter.post('/vendor/payment', stripeChargeForVendors);
stripebaseRouter.post('/cashapp/vendor/payment', cashappChargeForVendors);
stripebaseRouter.get('/successful/:orderid/:shop', stripeSuccess);
// productRouter.get('/cart-product', getOneProduct);


export const StripeController = { router: stripebaseRouter };
