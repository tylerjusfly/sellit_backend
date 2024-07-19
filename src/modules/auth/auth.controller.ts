import { Router } from 'express';
import {
	create,
	getMyProfile,
	loginUser,
	resendVerificationCode,
	verifyMail,
} from './auth.service';
import { loginValidationRules, verifyAccountSchema } from './auth.validations';
import { verifyToken } from '../../middlewares/verifyauth';
import { checkUsernameIsAvailable } from '../../middlewares/check-username-availability';
import { validateRequest } from '../../middlewares/validate-body';


const authRouter = Router();

authRouter.get('/me', verifyToken, getMyProfile);
authRouter.post('/login', loginValidationRules, loginUser);
authRouter.post('/create', checkUsernameIsAvailable, create);
authRouter.post('/verify-mail', validateRequest(verifyAccountSchema), verifyMail);
authRouter.post('/resend-code', resendVerificationCode);

export const AuthController = { router: authRouter };
