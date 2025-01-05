// import { Router } from 'express';
// import { verifyToken } from '../../middlewares/verifyauth';
// import {
// 	CreateCategories,
// 	deleteCategories,
// 	editCategories,
// 	fetchCategories,
// 	fetchCategoriesByShopName,
// 	fetchSingleCategory,
// } from './categories.service';

// const categoriesRouter = Router();

// categoriesRouter.post('/', verifyToken, CreateCategories);
// categoriesRouter.get('/', verifyToken, fetchCategories);
// categoriesRouter.patch('/', verifyToken, editCategories);
// categoriesRouter.get('/one', verifyToken, fetchSingleCategory);
// categoriesRouter.delete('/', verifyToken, deleteCategories);

// // Public
// categoriesRouter.get('/shop', fetchCategoriesByShopName);

// export const CategoriesController = { router: categoriesRouter };
