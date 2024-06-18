import { Request, Response, NextFunction } from 'express';
import { handleBadRequest } from '../constants/response-handler';

const validateRequest = (schema: any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error, value } = schema.validate(req.body);
		if (error) {
			return handleBadRequest(res, 400, error.details[0].message);
		}

		next();
	};
};

export default validateRequest;
