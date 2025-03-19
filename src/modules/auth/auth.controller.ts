import { Router } from 'express';
import { create, loginUser, resendVerificationCode, verifyMail } from './auth.service';
import { loginStoreSchema, verifyAccountSchema } from './auth.validations';
import { verifyToken } from '../../middlewares/verifyauth';
import { checkstorenameIsAvailable } from '../../middlewares/check-storename-availability';
import { validateRequest } from '../../middlewares/validate-body';

const authRouter = Router();

authRouter.post('/login', validateRequest(loginStoreSchema), loginUser);
authRouter.post('/create', checkstorenameIsAvailable, create);
authRouter.post('/verify-mail', validateRequest(verifyAccountSchema), verifyMail);
authRouter.post('/resend-code', resendVerificationCode);

export const AuthController = { router: authRouter };
