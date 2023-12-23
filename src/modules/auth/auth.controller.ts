import { Router } from 'express';
import { create, getMyProfile, loginUser } from './auth.service';
import { loginValidationRules } from './auth.validations';
import { verifyToken } from '../../middlewares/verifyauth';

const authRouter = Router();

authRouter.get('/me', verifyToken, getMyProfile);
authRouter.post('/login', loginValidationRules, loginUser);
authRouter.post('/create', create);

export const AuthController = { router: authRouter };
