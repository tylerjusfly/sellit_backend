import { Router } from 'express';
import { create, getMyProfile, loginUser } from './auth.service';
import { loginValidationRules } from './auth.validations';
import { verifyToken } from '../../middlewares/verifyauth';
import { checkUsernameIsAvailable } from '../../middlewares/check-username-availability';

const authRouter = Router();

authRouter.get('/me', verifyToken, getMyProfile);
authRouter.post('/login', loginValidationRules, loginUser);
authRouter.post('/create', checkUsernameIsAvailable, create);

export const AuthController = { router: authRouter };
