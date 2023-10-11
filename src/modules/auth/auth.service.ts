import { Request, Response } from 'express';
import { TLogin } from '../../interfaces/auth';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';

export async function loginUser(req: Request, res: Response) {
	try {
		const { username, password }: TLogin = req.body;

		if (!username || username?.length < 5 || !password || password?.length < 5) {
			return handleBadRequest(res, 400, 'password verification failed');
		}

		// const user = await User.findOne({ where: { username } });
		// if (!user) return handleBadRequest(res, 400, "invalid credentials");

		// let rs = await isValidPassword(user, password);
		// if (rs.success) {
		//   const token = await getToken(rs?.data?.id);
		//   return handleSuccess(res, token, rs?.message, 200, null);
		// }
		return handleSuccess(res, 2, 'success', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
}
