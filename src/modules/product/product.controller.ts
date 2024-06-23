import { Router } from 'express';
import {
	CreateProduct,
	deleteProduct,
	editProduct,
	fetchProductCategory,
	getAllProductByShop,
	getAllProductByShopname,
	getOneProduct,
	getSpecificProduct,
} from './product.service';
import { verifyToken } from '../../middlewares/verifyauth';
import { authorize } from '../../middlewares/confirm-permission';

const productRouter = Router();

productRouter.get('/', verifyToken, getAllProductByShop);
productRouter.get('/store', getAllProductByShopname);
productRouter.post('/', verifyToken, CreateProduct);
productRouter.patch('/', verifyToken, authorize(['product:read']), editProduct);
productRouter.get('/one', verifyToken, getSpecificProduct);
productRouter.delete('/', verifyToken, deleteProduct);

// Public routes
productRouter.get('/categories', fetchProductCategory);
productRouter.get('/cart-product', getOneProduct);

export const ProductController = { router: productRouter };
