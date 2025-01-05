import * as jwt from 'jsonwebtoken';
import { User } from '../database/entites/user.entity';

export interface ITokenPayload {
	id: string;
	storename: string;
	user_type: string;
	email: string;
	verified: boolean;
	permissions: string[];
}

export type cJwtPayload = Pick<ITokenPayload, 'storename' | 'user_type' | 'id'>;

export const JWT_SECRET = 'scagamore';

export const getPayload = (user: User): ITokenPayload => {
	const payload = {
		storename: user.storename,
		user_type: user.user_type,
		id: user.id,
		verified: user.active,
		email: user.email,
		permissions: JSON.parse(user.permissions) || [],
	};
	return payload;
};

export const getToken = async (user: User) => {
	const payload: ITokenPayload = getPayload(user);
	const token = jwt.sign(
		{
			storename: user.storename,
			user_type: user.user_type,
			id: user.id,
		},
		JWT_SECRET,
		{
			expiresIn: '24h',
		}
	);
	return {
		token,
		payload,
	};
};
