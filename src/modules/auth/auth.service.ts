import { Request, Response } from 'express';
import { TAdminLogin, TCreate, TLogin, TUserVerify } from '../../interfaces/auth';
import { validationResult } from 'express-validator';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { dataSource } from '../../database/dataSource';
import { isValidPassword } from '../../utils/password-helper';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { ITokenPayload, cJwtPayload, getPayload, getToken } from '../../utils/token-helper';
import { CustomRequest } from '../../middlewares/verifyauth';
import { adminKey, uniqueID } from '../../utils/generateIds';
import { Admins } from '../../database/entites/admins.entity';
import { sendUserVerificationToken } from '../../mail-providers/sendtokenmail';
import { Store } from '../../database/entites/store.entity';

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { storename, password }: TLogin = req.body;

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((err) => err.msg);

			const errorMessageString = errorMessages.join(' | ');

			return handleBadRequest(res, 400, errorMessageString);
		}

		const IsUser = await dataSource.getRepository(Store).findOne({
			where: {
				storename,
			},
		});

		if (!IsUser) {
			return handleBadRequest(res, 400, 'Invalid user credentials');
		}

		let rs = await isValidPassword(IsUser, password);

		if (!rs.success) {
			return handleBadRequest(res, 400, 'Invalid user credentials');
		}

		const token = await getToken(IsUser);

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

		const IsEmail = await dataSource.getRepository(Store).findOne({
			where: {
				email,
			},
		});

		if (IsEmail) {
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

export const getMyProfile = async (req: CustomRequest, res: Response) => {
	try {
		const userReq = req.user as cJwtPayload;

		const isUser = await dataSource.getRepository(Store).findOne({
			where: { id: userReq.id },
		});

		if (!isUser) return handleBadRequest(res, 404, 'user not found');

		return handleSuccess(res, { token: '', payload: getPayload(isUser) }, 'user', 200, undefined);
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

		const userWithEmail = await dataSource.getRepository(Store).findOne({
			where: {
				email,
			},
		});

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

		const userWithEmail = await dataSource.getRepository(Store).findOne({
			where: {
				email,
			},
		});

		if (!userWithEmail) {
			return handleSuccess(res, {}, 'user', 200, undefined);
		}

		const verificationToken = adminKey(4);
		userWithEmail.token = verificationToken;

		await userWithEmail.save();

		/**SEND VERIFICATION EMAIL */
		await sendUserVerificationToken(userWithEmail);

		return handleSuccess(res, {}, 'user', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};