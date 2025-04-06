import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth.js';
import { connectPayment, disconnectPayment, fetchShopPayments } from './payment.service.js';
import { paymentOrderSchema } from '../order/order.validation.js';
import { validateQueryRequest, validateRequest } from '../../middlewares/validate-body.js';
import { authorize } from '../../middlewares/confirm-permission.js';

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
	authorize(['payment:create']),
	validateRequest(paymentOrderSchema),
	disconnectPayment
);

paymentSettingsRouter.post(
	'/connect',
	verifyToken,
	authorize(['payment:create']),
	validateRequest(paymentOrderSchema),
	connectPayment
);

export const paymentSettingsController = { router: paymentSettingsRouter };
