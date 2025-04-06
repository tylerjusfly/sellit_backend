import { Router } from 'express';
import { create, loginUser, resendVerificationCode, verifyMail } from './auth.service.js';
import { loginStoreSchema, verifyAccountSchema } from './auth.validations.js';
import { verifyToken } from '../../middlewares/verifyauth.js';
import { checkstorenameIsAvailable } from '../../middlewares/check-storename-availability.js';
import { validateRequest } from '../../middlewares/validate-body.js';

const authRouter = Router();

authRouter.post('/login', validateRequest(loginStoreSchema), loginUser);
authRouter.post('/create', checkstorenameIsAvailable, create);
authRouter.post('/verify-mail', validateRequest(verifyAccountSchema), verifyMail);
authRouter.post('/resend-code', resendVerificationCode);

export const AuthController = { router: authRouter };
