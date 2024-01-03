import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth';
import { CreateCategories } from './categories.service';

const categoriesRouter = Router();

categoriesRouter.post('/', /*verifyToken,*/ CreateCategories);

export const CategoriesController = { router: categoriesRouter };
