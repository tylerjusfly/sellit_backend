import type { Request, Response, NextFunction } from 'express';
import { handleBadRequest } from '../constants/response-handler.js';

export const validateRequest = (schema: any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error, value } = schema.validate(req.body);
		if (error) {
			return handleBadRequest(res, 400, error.details[0].message);
		}

		next();
	};
};

export const validateQueryRequest = (schema: any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error, value } = schema.validate(req.query);
		if (error) {
			return handleBadRequest(res, 400, error.details[0].message);
		}

		next();
	};
};
