import { Router } from 'express';

import {
	createShop,
	deleteShop,
	getAllShops,
	authenticateShop,
	authenticateShopByname,
	shopEdit,
} from './shop.service';
import { verifyToken } from '../../middlewares/verifyauth';
import { authorize } from '../../middlewares/confirm-permission';
import { validateRequest } from '../../middlewares/validate-body';
import { shopEditSchema } from './shop.schema';

const shopRouter = Router();

shopRouter.get('/', verifyToken, getAllShops);
shopRouter.post('/', verifyToken, createShop);
shopRouter.patch('/', verifyToken, validateRequest(shopEditSchema), shopEdit);
shopRouter.post('/auth-shop', verifyToken, authenticateShop);
shopRouter.delete('/', verifyToken, authorize(['admin:delete']), deleteShop);

// public
shopRouter.get('/get-shop', authenticateShopByname);

export const ShopController = { router: shopRouter };
