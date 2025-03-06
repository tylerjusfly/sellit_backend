import * as jwt from 'jsonwebtoken';
import { Store } from '../database/entites/store.entity';

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

export const getPayload = (store: Store): ITokenPayload => {
	const payload = {
		storename: store.storename,
		user_type: store.user_type,
		id: store.id,
		verified: store.active,
		email: store.email,
		permissions: JSON.parse(store.permissions) || [],
	};
	return payload;
};

export const getToken = async (store: Store) => {
	const payload: ITokenPayload = getPayload(store);
	const token = jwt.sign(
		{
			storename: store.storename,
			user_type: store.user_type,
			id: store.id,
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
