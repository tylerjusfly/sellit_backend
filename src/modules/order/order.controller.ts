import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth';
import { approveOrder, createOrder, getAllOrder, getOrderById } from './order.service';

const orderRouter = Router();

orderRouter.post('/', createOrder);
orderRouter.get('/one', getOrderById);
orderRouter.get('/shop-orders', verifyToken, getAllOrder);
orderRouter.post('/shop-orders/approve', verifyToken, approveOrder);
// orderRouter.post('/', verifyToken, createOrder);

export const OrderController = { router: orderRouter };
