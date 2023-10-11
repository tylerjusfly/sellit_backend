import { Router } from 'express';
import { loginUser } from './auth.service';

const authRouter = Router();

authRouter.post('/login', loginUser);

export const AuthController = { router: authRouter };
