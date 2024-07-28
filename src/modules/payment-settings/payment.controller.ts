import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth';
import { connectPayment, disconnectPayment, fetchShopPayments } from './payment.service';
import { paymentOrderSchema } from '../order/order.validation';
import { validateQueryRequest, validateRequest } from '../../middlewares/validate-body';

const paymentSettingsRouter = Router();

paymentSettingsRouter.get(
	'/',
	verifyToken,
	validateQueryRequest(paymentOrderSchema),
	fetchShopPayments
);
paymentSettingsRouter.post(
	'/disconnect',
	verifyToken,
	validateQueryRequest(paymentOrderSchema),
	disconnectPayment
);

paymentSettingsRouter.post(
	'/connect',
	verifyToken,
	validateRequest(paymentOrderSchema),
	connectPayment
);

// Public routes
// coinbaseRouter.post('/vendor/payment', coinBaseChargeForVendors);

export const paymentSettingsController = { router: paymentSettingsRouter };
