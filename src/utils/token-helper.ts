import { TShopType } from '../interfaces/shop';
import { TUserType } from '../interfaces/user';
import * as jwt from 'jsonwebtoken';

export interface ITokenPayload {
	username: string;
	user_type: string;
	id: number;
}

const secret = 'scagamore';

export const getPayload = (user: TUserType): ITokenPayload => {
	const payload = {
		username: user.username,
		user_type: user.user_type,
		id: user.id,
	};
	return payload;
};

export const getToken = async (user: TUserType) => {
	const payload: ITokenPayload = getPayload(user);
	const token = jwt.sign(payload, secret, {
		expiresIn: 300000,
	});
	return {
		token,
		payload,
	};
};

export const getShopPayload = (shop: TShopType): null => {
	return null;
};
