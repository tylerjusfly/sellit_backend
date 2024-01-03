import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth';
import { CreateCategories, fetchCategories } from './categories.service';

const categoriesRouter = Router();

categoriesRouter.post('/', /*verifyToken,*/ CreateCategories);
categoriesRouter.get('/', /*verifyToken,*/ fetchCategories);

export const CategoriesController = { router: categoriesRouter };
