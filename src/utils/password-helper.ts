import { pbkdf2Sync, randomBytes } from 'crypto';
import type { TUserType } from '../interfaces/user.js';

export interface IResult {
	success: boolean;
	data?: TUserType;
}

export const isValidPassword = async (user: TUserType, password: string): Promise<IResult> => {
	const { salt } = user;

	var hash = pbkdf2Sync(password, salt || '', 1000, 64, `sha512`).toString(`hex`);
	if (user.password === hash) {
		return { success: true, data: user };
	}
	return { success: false };
};
