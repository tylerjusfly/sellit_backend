import { Router } from 'express';

import { createShop, deleteShop, getAllShops, authenticateShop } from './shop.service';
import { verifyToken } from '../../middlewares/verifyauth';

const shopRouter = Router();

shopRouter.get('/', verifyToken, getAllShops);
shopRouter.post('/', verifyToken, createShop);
shopRouter.post('/auth-shop', verifyToken, authenticateShop);
shopRouter.delete('/', deleteShop);

export const ShopController = { router: shopRouter };
