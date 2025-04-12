import type { Request, Response } from 'express';
import type { TAdminLogin, TCreate, TLogin, TUserVerify } from '../../interfaces/auth.js';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler.js';
import { dataSource } from '../../database/dataSource.js';
import { isValidPassword } from '../../utils/password-helper.js';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { getToken, type ITokenPayload } from '../../utils/token-helper.js';
import { adminKey, uniqueID } from '../../utils/generateIds.js';
import { Admins } from '../../database/entites/admins.entity.js';
import {
	sendUserResetTokenEmail,
	sendUserVerificationToken,
} from '../../mailproviders/sendtokenmail.js';
import { Store } from '../../database/entites/store.entity.js';
import { getStoreByEmail, getStoreByStorename } from '../store/storehelpers.js';
import type { CustomRequest } from '../../middlewares/verifyauth.js';

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { storename, password }: TLogin = req.body;

		const IsStore = await getStoreByStorename(storename);

		if (!IsStore) {
			return handleBadRequest(res, 400, 'Invalid user credentials');
		}

		let rs = await isValidPassword(IsStore, password);

		if (!rs.success) {
			return handleBadRequest(res, 400, 'Invalid user credentials');
		}

		const token = await getToken(IsStore);

		return handleSuccess(res, token, 'success', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const create = async (req: Request, res: Response) => {
	try {
		const { storename, email, password }: TCreate = req.body;

		if (!storename || !email || !password) {
			return handleBadRequest(res, 400, 'all fields are required');
		}

		const storeExist = await getStoreByEmail(email);

		if (storeExist) {
			return handleBadRequest(res, 400, 'email already exists');
		}

		const salt = randomBytes(30).toString('hex');
		const hashedPass = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

		const verificationToken = adminKey(4);

		const createdStore = dataSource.getRepository(Store).create({
			storename: storename.toLowerCase(),
			password: hashedPass,
			token: verificationToken,
			email,
			salt,
		});

		await dataSource.getRepository(Store).save(createdStore);

		/**SEND VERIFICATION EMAIL */
		await sendUserVerificationToken(createdStore);

		return handleSuccess(res, {}, 'created store', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const loginAdmin = async (req: Request, res: Response) => {
	try {
		const { email, password }: TAdminLogin = req.body;

		if (!email || !password) {
			return handleBadRequest(res, 400, 'email/password is required');
		}

		// Does admin exist
		const IsAdmin = await dataSource.getRepository(Admins).findOne({
			where: {
				email,
			},
		});

		if (!IsAdmin) {
			return handleBadRequest(res, 400, 'Invalid credentials');
		}

		let privatekey = adminKey(5);
		let adminID = uniqueID(8);

		return handleSuccess(res, { token: '' }, 'user', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const verifyMail = async (req: Request, res: Response) => {
	try {
		const { email, code }: TUserVerify = req.body;

		const userWithEmail = await getStoreByEmail(email);

		if (!userWithEmail) {
			return handleBadRequest(res, 400, 'verification failed');
		}

		if (userWithEmail.active) {
			return handleBadRequest(res, 400, 'Account is already verified');
		}

		if (userWithEmail.token !== code) {
			return handleBadRequest(res, 400, 'verification failed');
		}

		userWithEmail.token = null;
		userWithEmail.active = true;

		await userWithEmail.save();

		return handleSuccess(res, {}, 'user', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const resendVerificationCode = async (req: Request, res: Response) => {
	try {
		const email = req.body.email;

		if (!email) {
			return handleBadRequest(res, 400, 'email is required');
		}

		const storeWithEmail = await getStoreByEmail(email);

		if (!storeWithEmail) {
			return handleSuccess(res, {}, 'user', 200, undefined);
		}

		const verificationToken = adminKey(4);
		storeWithEmail.token = verificationToken;

		await storeWithEmail.save();

		/**SEND VERIFICATION EMAIL */
		await sendUserVerificationToken(storeWithEmail);

		return handleSuccess(res, {}, 'user', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const changePassword = async (req: CustomRequest, res: Response) => {
	try {
		const { current_password, new_password } = req.body;

		const store = req.user as ITokenPayload;

		const storeExist = await getStoreByEmail(store.email);

		if (!storeExist) {
			return handleBadRequest(res, 400, 'this store does not belong to the loggedIn user');
		}

		let rs = await isValidPassword(storeExist, current_password);

		if (!rs.success) {
			return handleBadRequest(res, 400, 'Invalid user credentials');
		}

		const salt = randomBytes(30).toString('hex');
		const hashedPass = pbkdf2Sync(new_password, salt, 1000, 64, `sha512`).toString(`hex`);

		const verificationToken = adminKey(4);

		storeExist.active = false;
		storeExist.salt = salt;
		storeExist.password = hashedPass;
		storeExist.token = verificationToken;

		await storeExist.save();

		/**SEND VERIFICATION EMAIL */
		await sendUserResetTokenEmail(storeExist);

		return handleSuccess(res, {}, 'password reset', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};
