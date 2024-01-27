import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth';
import { createOrder } from './order.service';

const orderRouter = Router();

orderRouter.post('/', createOrder);
// orderRouter.post('/', verifyToken, createOrder);

export const OrderController = { router: orderRouter };
