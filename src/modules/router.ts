import { Router } from 'express';
import { AuthController } from './auth/auth.controller';

const router = Router();

router.use('/auth', AuthController.router);
// router.use('/technology', TechnologyController.router);
// router.use('/queue', QueueRouter.router);

export const apiRouter = router;
