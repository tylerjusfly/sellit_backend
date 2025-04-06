import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth.js';
import {
	CreateBlacklist,
	deleteBlacklist,
	fetchBlacklist,
	isDataInBlacklist,
} from './blacklist.service.js';
import { validateRequest } from '../../middlewares/validate-body.js';
import { postBlacklistSchema } from './blacklist.schema.js';

const blacklistsRouter = Router();

blacklistsRouter.post('/', verifyToken, validateRequest(postBlacklistSchema), CreateBlacklist);
blacklistsRouter.get('/', verifyToken, fetchBlacklist);
blacklistsRouter.delete('/', verifyToken, deleteBlacklist);

blacklistsRouter.post('/check', validateRequest(postBlacklistSchema), isDataInBlacklist);

export const BlacklistsController = { router: blacklistsRouter };
