import { Request, Response } from 'express';
import { TAdminLogin, TCreate, TLogin } from '../../interfaces/auth';
import { validationResult } from 'express-validator';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { dataSource } from '../../database/dataSource';
import { User } from '../../database/entites/user.entity';
import { isValidPassword } from '../../utils/password-helper';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { ITokenPayload, getToken } from '../../utils/token-helper';
import { CustomRequest } from '../../middlewares/verifyauth';
import { adminKey, uniqueID } from '../../utils/generateIds';
import { Admins } from '../../database/entites/admins.entity';

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { username, password }: TLogin = req.body;

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((err) => err.msg);

			const errorMessageString = errorMessages.join(' | ');

			return handleBadRequest(res, 400, errorMessageString);
		}

		const IsUser = await dataSource.getRepository(User).findOne({
			where: {
				username,
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
		const { username, fullname, email, password }: TCreate = req.body;

		if (!fullname || !email || !password) {
			return handleBadRequest(res, 400, 'all fields are required');
		}

		const IsEmail = await dataSource.getRepository(User).findOne({
			where: {
				email,
			},
		});

		if (IsEmail) {
			return handleBadRequest(res, 400, 'email already exists');
		}

		const salt = randomBytes(30).toString('hex');
		const hashedPass = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

		const createdUser = dataSource.getRepository(User).create({
			username,
			password: hashedPass,
			fullname,
			email,
			salt,
		});
		const results = await dataSource.getRepository(User).save(createdUser);

		/**SEND VERIFICATION EMAIL */

		return handleSuccess(res, results, 'created user', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const getMyProfile = async (req: CustomRequest, res: Response) => {
	try {
		const userReq = req.user as ITokenPayload;

		const isUser = await dataSource.getRepository(User).findOne({
			where: { id: userReq.id },
		});

		if (!isUser) return handleBadRequest(res, 404, 'user not found');

		const formattedUserData = {
			id: isUser.id,
			username: isUser.username,
			user_type: isUser.user_type,
			verified: isUser.active,
			email: isUser.email,
		};

		return handleSuccess(res, { token: '', payload: formattedUserData }, 'user', 200, undefined);
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
