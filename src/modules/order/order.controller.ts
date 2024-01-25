import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth';

const orderRouter = Router();

// orderRouter.get('/', verifyToken, getAllShops);

export const OrderController = { router: orderRouter };
