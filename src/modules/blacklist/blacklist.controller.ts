import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth';
import { CreateBlacklist, deleteBlacklist, fetchBlacklist } from './blacklist.service';
import { validateRequest } from '../../middlewares/validate-body';
import { postBlacklistSchema } from './blacklist.schema';

const blacklistsRouter = Router();

blacklistsRouter.post('/', verifyToken, validateRequest(postBlacklistSchema), CreateBlacklist);
blacklistsRouter.get('/', verifyToken, fetchBlacklist);
blacklistsRouter.delete('/', verifyToken, deleteBlacklist);

export const BlacklistsController = { router: blacklistsRouter };
