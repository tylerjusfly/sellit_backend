import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth';
import {
	CreateBlacklist,
	deleteBlacklist,
	fetchBlacklist,
	isDataInBlacklist,
} from './blacklist.service';
import { validateRequest } from '../../middlewares/validate-body';
import { postBlacklistSchema } from './blacklist.schema';

const blacklistsRouter = Router();

blacklistsRouter.post('/', verifyToken, validateRequest(postBlacklistSchema), CreateBlacklist);
blacklistsRouter.get('/', verifyToken, fetchBlacklist);
blacklistsRouter.delete('/', verifyToken, deleteBlacklist);

blacklistsRouter.post('/check', validateRequest(postBlacklistSchema), isDataInBlacklist);

export const BlacklistsController = { router: blacklistsRouter };
