import { Router } from 'express';

import { createShop, deleteShop, getAllShops } from './shop.service';

const shopRouter = Router();

shopRouter.get('/', getAllShops);
shopRouter.post('/', createShop);
shopRouter.delete('/', deleteShop);

export const ShopController = { router: shopRouter };
