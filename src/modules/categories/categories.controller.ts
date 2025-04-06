import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth.js';
import {
	CreateCategories,
	fetchCategories,
	deleteCategories,
	editCategories,
	// fetchCategories,
	// fetchCategoriesByShopName,
	// fetchSingleCategory,
} from './categories.service.js';
import { validateRequest } from '../../middlewares/validate-body.js';
import { createCategorySchema, editCategorySchema } from './category.validation.js';

const categoriesRouter = Router();

categoriesRouter.post('/', verifyToken, validateRequest(createCategorySchema), CreateCategories);
categoriesRouter.patch('/', verifyToken, validateRequest(editCategorySchema), editCategories);
categoriesRouter.delete('/', verifyToken, deleteCategories);

categoriesRouter.get('/', fetchCategories);


// // Public
// categoriesRouter.get('/shop', fetchCategoriesByShopName);

export const CategoriesController = { router: categoriesRouter };
