import { Router } from 'express';
import { create, loginUser } from './auth.service';
import { loginValidationRules } from './auth.validations';

const authRouter = Router();

authRouter.post('/login', loginValidationRules, loginUser);
authRouter.post('/create', create);

export const AuthController = { router: authRouter };
