import { Router } from 'express';
import { CreateProduct } from './product.service';
import { verifyToken } from '../../middlewares/verifyauth';

const productRouter = Router();

productRouter.post('/', verifyToken, CreateProduct);

export const ProductController = { router: productRouter };
