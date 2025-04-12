import { Router } from 'express';
import {
	changePassword,
	create,
	loginUser,
	resendVerificationCode,
	verifyMail,
} from './auth.service.js';
import { changePasswordSchema, loginStoreSchema, verifyAccountSchema } from './auth.validations.js';
import { verifyToken } from '../../middlewares/verifyauth.js';
import { checkstorenameIsAvailable } from '../../middlewares/check-storename-availability.js';
import { validateRequest } from '../../middlewares/validate-body.js';
import { authorize } from '../../middlewares/confirm-permission.js';

const authRouter = Router();

authRouter.post('/login', validateRequest(loginStoreSchema), loginUser);
authRouter.post('/create', checkstorenameIsAvailable, create);
authRouter.post('/verify-mail', validateRequest(verifyAccountSchema), verifyMail);
authRouter.post('/resend-code', resendVerificationCode);
authRouter.post(
	'/change-password',
	verifyToken,
	// authorize(['auth:create']),
	validateRequest(changePasswordSchema),
	changePassword
);

export const AuthController = { router: authRouter };
