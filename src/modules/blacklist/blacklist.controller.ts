import { Router } from 'express';
import { verifyToken } from '../../middlewares/verifyauth';
import { CreateBlacklist, fetchBlacklist } from './blacklist.service';
import { validateRequest } from '../../middlewares/validate-body';
import { postBlacklistSchema } from './blacklist.schema';
import { BlackLists } from '../../database/entites/blacklist.entity';
import { deleteMiddleware } from '../../middlewares/delete-item';

const blacklistsRouter = Router();

blacklistsRouter.post('/', verifyToken, validateRequest(postBlacklistSchema), CreateBlacklist);
blacklistsRouter.get('/', verifyToken, fetchBlacklist);
blacklistsRouter.delete('/', verifyToken, deleteMiddleware(BlackLists));

export const BlacklistsController = { router: blacklistsRouter };
