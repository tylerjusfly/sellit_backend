import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth.js';

import { validateRequest } from '../../middlewares/validate-body.js';
import { authorize } from '../../middlewares/confirm-permission.js';
import { CustomerRetention } from './analytics.service.js';

const analyticsRouter = Router();


analyticsRouter.post('/customer-retention', verifyToken, CustomerRetention);


export const AnalyticsController = { router: analyticsRouter };
