import { Router } from 'express';
import {
	CreateProduct,
	deleteProduct,
	editProduct,
	getAllProductByShop,
	getOneProduct,
	getProductsForPublic,
	getSpecificProduct,
} from './product.service.js';
import { verifyToken } from '../../middlewares/verifyauth.js';
import { authorize } from '../../middlewares/confirm-permission.js';
import { checkPaymentTypeVlidity } from '../../middlewares/check-payment-type-validity.js';

const productRouter = Router();

productRouter.get('/', verifyToken, getAllProductByShop);
productRouter.post('/', verifyToken, CreateProduct);
productRouter.patch(
	'/',
	verifyToken,
	authorize(['product:read']),
	checkPaymentTypeVlidity,
	editProduct
);
productRouter.get('/one', verifyToken, getSpecificProduct);
productRouter.delete('/', verifyToken, deleteProduct);

// Public routes
productRouter.get('/store', getProductsForPublic);
productRouter.get('/view', getOneProduct);

export const ProductController = { router: productRouter };
