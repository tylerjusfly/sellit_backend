import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth';

import { checkstorenameIsAvailable } from '../../middlewares/check-storename-availability';

import { validateQueryRequest } from '../../middlewares/validate-body';
import { getCustomization, InitializeCustomization, updateCustomization } from './customization.service';

const customizeRouter = Router();

customizeRouter.get('/', verifyToken, getCustomization);
customizeRouter.post('/init', verifyToken, InitializeCustomization);
customizeRouter.patch('/update', verifyToken, updateCustomization);




export const CustomizationController = { router: customizeRouter };
