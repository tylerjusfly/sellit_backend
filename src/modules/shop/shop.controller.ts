import { Router } from 'express';

import {
	createShop,
	deleteShop,
	getAllShops,
	authenticateShop,
	authenticateShopByname,
} from './shop.service';
import { verifyToken } from '../../middlewares/verifyauth';
import { authorize } from '../../middlewares/confirm-permission';

const shopRouter = Router();

shopRouter.get('/', verifyToken, getAllShops);
shopRouter.post('/', verifyToken, createShop);
shopRouter.post('/auth-shop', verifyToken, authenticateShop);
shopRouter.delete('/', verifyToken, authorize(['shop:delete']), deleteShop);

// public
shopRouter.get('/get-shop', authenticateShopByname);

export const ShopController = { router: shopRouter };
