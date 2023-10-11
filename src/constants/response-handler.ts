import { Response } from 'express';
import { LogHelper } from '../utils/LogHelper';
import { IPaging } from '../interfaces/general';

export const handleSuccess = (
	res: Response,
	data: any,
	mess: string,
	statusCode: number,
	meta: IPaging | undefined
) => {
	const code = statusCode ? statusCode : 200;
	const message = mess ? mess : undefined;
	const result = data ? data : undefined;
	const paging = meta ? meta : undefined;

	return res.status(code).send({
		success: true,
		message,
		result,
		paging,
	});
};

export const handleBadRequest = (res: Response, statusCode: number, message: string) => {
	return res.status(statusCode).send({
		success: false,
		message: message || 'bad request',
	});
};

export const handleError = (res: Response | null, error: any) => {
	console.error('An unexpected error occurred', error);
	LogHelper.error(error?.message);
	if (!res)
		return {
			success: false,
			message: error.message || 'an error occurred',
		};

	return res.status(400).send({
		success: false,
		message: error.message || 'an error occurred',
	});
};
