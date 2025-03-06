import { Router } from 'express';
import {
	CreateProduct,
	deleteProduct,
	editProduct,
	getAllProductByShop,
	// getAllProductByShopname,
	getOneProduct,
	getSpecificProduct,
} from './product.service';
import { verifyToken } from '../../middlewares/verifyauth';
import { authorize } from '../../middlewares/confirm-permission';
import { checkPaymentTypeVlidity } from '../../middlewares/check-payment-type-validity';

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
// productRouter.get('/store', getAllProductByShopname);
// productRouter.get('/categories', fetchProductCategory);
productRouter.get('/cart-product', getOneProduct);

export const ProductController = { router: productRouter };
