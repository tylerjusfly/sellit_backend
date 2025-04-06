import jwt from 'jsonwebtoken';
import { handleBadRequest } from '../constants/response-handler.js';
import { JWT_SECRET } from '../utils/token-helper.js';

import type { JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
	user?: string | JwtPayload;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.header('Authorization')) {
			return handleBadRequest(res, 403, 'no token headers');
		}

		const token = req.header('Authorization')?.replace('Bearer ', '');

		if (!token) {
			return handleBadRequest(res, 401, 'un-authorised');
		}

		const decoded = jwt.verify(token, JWT_SECRET);
		(req as CustomRequest).user = decoded;

		next();
	} catch (error) {
		console.log(error, 'err');
		return handleBadRequest(res, 401, 'jwt Error');
	}
};
