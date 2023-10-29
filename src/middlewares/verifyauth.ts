import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { handleBadRequest } from '../constants/response-handler';

export interface CustomRequest extends Request {
	user?: string | JwtPayload;
}

const SECRET_KEY = 'scagamore';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	if (!req.header('Authorization')) {
		return handleBadRequest(res, 403, 'no token headers');
	}
	//   let token = req.headers[authorization];

	const token = req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return handleBadRequest(res, 401, 'un-authorised');
	}

	const decoded = jwt.verify(token, SECRET_KEY);
	(req as CustomRequest).user = decoded;

	next();
};
