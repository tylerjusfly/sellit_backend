import { Router } from 'express';
import {
	cashappChargeForVendors,
	stripeChargeForVendors,
	stripeSuccess,
} from './stripe.service.js';

const stripebaseRouter = Router();

// stripebaseRouter.post('/api/vendor/stripe/onboard', verifyToken, onBoardStripeUsers);

// Public routes
stripebaseRouter.post('/vendor/payment', stripeChargeForVendors);
stripebaseRouter.post('/cashapp/vendor/payment', cashappChargeForVendors);
stripebaseRouter.get('/successful/:orderid/:shop', stripeSuccess);


export const StripeController = { router: stripebaseRouter };
