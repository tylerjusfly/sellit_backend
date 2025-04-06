import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth.js';
import {
	getCustomization,
	InitializeCustomization,
	updateCustomization,
} from './customization.service.js';

const customizeRouter = Router();

customizeRouter.get('/', verifyToken, getCustomization);
customizeRouter.post('/init', verifyToken, InitializeCustomization);
customizeRouter.patch('/update', verifyToken, updateCustomization);

export const CustomizationController = { router: customizeRouter };
