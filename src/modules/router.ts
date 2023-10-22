import { Router } from 'express';
import { AuthController } from './auth/auth.controller';
import { ShopController } from './shop/shop.controller';

const router = Router();

router.use('/auth', AuthController.router);
router.use('/shops', ShopController.router);
// router.use('/queue', QueueRouter.router);

export const apiRouter = router;
