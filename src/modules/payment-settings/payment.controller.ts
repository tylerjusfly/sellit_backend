import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth';
import { connectPayment, disconnectPayment, fetchShopPayments } from './payment.service';
import { paymentOrderSchema } from '../order/order.validation';
import { validateQueryRequest, validateRequest } from '../../middlewares/validate-body';
import { authorize } from '../../middlewares/confirm-permission';

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
	validateQueryRequest(paymentOrderSchema),
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
