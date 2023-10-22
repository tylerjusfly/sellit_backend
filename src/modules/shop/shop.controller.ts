import { Router } from 'express';

import { createShop, getAllShops } from './shop.service';

const shopRouter = Router();

shopRouter.get('/', getAllShops);
shopRouter.post('/', createShop);

export const ShopController = { router: shopRouter };
