import { Router } from 'express';

import { verifyToken } from '../../middlewares/verifyauth';
import { getshopdata } from './store.service';

const storeRouter = Router();

storeRouter.get('/', verifyToken, getshopdata);



export const StoreController = { router: storeRouter };
