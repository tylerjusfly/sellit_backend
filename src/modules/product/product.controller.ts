import { Router } from 'express';
import {
	CreateProduct,
	deleteProduct,
	editProduct,
	getAllProductByShop,
	getAllProductByShopname,
	getSpecificProduct,
} from './product.service';
import { verifyToken } from '../../middlewares/verifyauth';
import { rateLimiter } from '../../middlewares/rate-limiter';

const productRouter = Router();

productRouter.get('/', verifyToken, getAllProductByShop);
productRouter.get('/store', getAllProductByShopname);
productRouter.post('/', verifyToken, CreateProduct);
productRouter.patch('/', verifyToken, editProduct);
productRouter.get('/one', verifyToken, rateLimiter, getSpecificProduct);
productRouter.delete('/', verifyToken, deleteProduct);

export const ProductController = { router: productRouter };
