import { Router } from 'express';
import {
	CreateProduct,
	deleteProduct,
	editProduct,
	getAllProductByShop,
	getSpecificProduct,
} from './product.service';
import { verifyToken } from '../../middlewares/verifyauth';

const productRouter = Router();

productRouter.get('/', verifyToken, getAllProductByShop);
productRouter.post('/', CreateProduct);
productRouter.patch('/', verifyToken, editProduct);
productRouter.get('/one', verifyToken, getSpecificProduct);
productRouter.delete('/', verifyToken, deleteProduct);

export const ProductController = { router: productRouter };
