import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth';
import { CreateCategories, deleteCategories, fetchCategories } from './categories.service';

const categoriesRouter = Router();

categoriesRouter.post('/', verifyToken, CreateCategories);
categoriesRouter.get('/', verifyToken, fetchCategories);
categoriesRouter.delete('/', verifyToken, deleteCategories);

export const CategoriesController = { router: categoriesRouter };
