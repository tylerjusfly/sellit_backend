import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth';
import { createOrder, getOrderById } from './order.service';

const orderRouter = Router();

orderRouter.post('/', createOrder);
orderRouter.get('/one', getOrderById);
// orderRouter.post('/', verifyToken, createOrder);

export const OrderController = { router: orderRouter };
