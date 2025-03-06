import { NextFunction, Request, Response } from 'express';
import { handleBadRequest } from '../constants/response-handler';
import { Store } from '../database/entites/store.entity';
import { dataSource } from '../database/dataSource';

export const checkstorenameIsAvailable = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const storename = req.body.storename as string;

	if (!storename) {
		return handleBadRequest(res, 400, 'storename is required');
	}

	const storenameExists = await dataSource.getRepository(Store).findOne({
		where: {
			storename,
		},
	});

	if (storenameExists) {
		return handleBadRequest(res, 400, 'storename is taken');
	}

	next();
};
