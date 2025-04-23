import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth.js';
import {
	fetchNotificationSettings,
	getshopdata,
	getstoreInPublic,
	updateNotificationSettings,
	updateStorename,
} from './store.service.js';
import { checkstorenameIsAvailable } from '../../middlewares/check-storename-availability.js';
import { StoreOrderSchema } from './store.validation.js';
import { validateQueryRequest } from '../../middlewares/validate-body.js';

const storeRouter = Router();

storeRouter.get('/', verifyToken, getshopdata);
storeRouter.patch('/update/name', verifyToken, checkstorenameIsAvailable, updateStorename);
storeRouter.get('/notify-settings', verifyToken, fetchNotificationSettings);
storeRouter.patch('/notify-settings', verifyToken, updateNotificationSettings);

storeRouter.get('/public', validateQueryRequest(StoreOrderSchema), getstoreInPublic);



export const StoreController = { router: storeRouter };
