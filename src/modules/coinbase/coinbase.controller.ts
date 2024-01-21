import { Router } from 'express';
import { coinBaseChargeForVendors } from './coinbase.service';

const coinbaseRouter = Router();

// productRouter.get('/', verifyToken, getAllProductByShop);

// Public routes
coinbaseRouter.post('/vendor/payment', coinBaseChargeForVendors);
// productRouter.get('/cart-product', getOneProduct);

export const CoinbaseController = { router: coinbaseRouter };
