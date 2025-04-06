import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth.js';
import {
	approveOrder,
	createOrder,
	disapproveOrder,
	getAllOrder,
	getOrderById,
	getPopularPayment,
} from './order.service.js';

import { paymentOrderSchema } from './order.validation.js';
import { validateQueryRequest } from '../../middlewares/validate-body.js';
import { authorize } from '../../middlewares/confirm-permission.js';

const orderRouter = Router();

orderRouter.post('/', createOrder);
orderRouter.get('/one', getOrderById);
orderRouter.get('/shop-orders', verifyToken, getAllOrder);
orderRouter.post('/shop-orders/approve', verifyToken, authorize(['order:edit']), approveOrder);
orderRouter.post(
	'/shop-orders/disapprove',
	verifyToken,
	authorize(['order:edit']),
	disapproveOrder
);
orderRouter.get(
	'/popular-payments',
	// verifyToken,
	validateQueryRequest(paymentOrderSchema),
	getPopularPayment
);


export const OrderController = { router: orderRouter };
