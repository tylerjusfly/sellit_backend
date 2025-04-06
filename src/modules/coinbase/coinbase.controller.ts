import { Router } from 'express';
import { coinBaseChargeForVendors, coinbaseSuccess } from './coinbase.service.js';

const coinbaseRouter = Router();

// productRouter.get('/', verifyToken, getAllProductByShop);

// Public routes
coinbaseRouter.post('/vendor/payment', coinBaseChargeForVendors);
coinbaseRouter.get('/success/:orderid/:shop', coinbaseSuccess);
// productRouter.get('/cart-product', getOneProduct);

export const CoinbaseController = { router: coinbaseRouter };
