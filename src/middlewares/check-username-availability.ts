import { NextFunction, Request, Response } from 'express';
import { handleBadRequest } from '../constants/response-handler';
import { User } from '../database/entites/user.entity';
import { dataSource } from '../database/dataSource';

export const checkUsernameIsAvailable = async (req: Request, res: Response, next: NextFunction) => {
	const username = req.body.username as string;

	if (!username) {
		return handleBadRequest(res, 400, 'username is required');
	}

	const usernameExists = await dataSource.getRepository(User).findOne({
		where: {
			username,
		},
	});

	if (usernameExists) {
		return handleBadRequest(res, 400, 'username is taken');
	}

	next();
};
