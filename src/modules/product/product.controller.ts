import { Router } from 'express';
import { CreateProduct, editProduct, getSpecificProduct } from './product.service';
import { verifyToken } from '../../middlewares/verifyauth';

const productRouter = Router();

productRouter.post('/', CreateProduct);
productRouter.patch('/', verifyToken, editProduct);
productRouter.get('/one', verifyToken, getSpecificProduct);

export const ProductController = { router: productRouter };
