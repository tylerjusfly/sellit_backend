import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth.js';
import { getshopdata, getstoreInPublic, updateStorename } from './store.service';
import { checkstorenameIsAvailable } from '../../middlewares/check-storename-availability';
import { StoreOrderSchema } from './store.validation';
import { validateQueryRequest } from '../../middlewares/validate-body';

const storeRouter = Router();

storeRouter.get('/', verifyToken, getshopdata);
storeRouter.patch('/update/name', verifyToken, checkstorenameIsAvailable, updateStorename);

storeRouter.get('/public', validateQueryRequest(StoreOrderSchema), getstoreInPublic);



export const StoreController = { router: storeRouter };
