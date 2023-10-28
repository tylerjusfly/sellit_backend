import { Request, Response } from 'express';
import { LogHelper } from '../utils/LogHelper';

export const requsetLogger = (req: Request, res: Response, next: Function) => {
	const { method, originalUrl: url, ip, protocol } = req;

	const { statusCode } = res;
	let message = `${method} ${url} ${statusCode} - ${protocol} ${ip}`;

	LogHelper.info(`\x1b[33m ${message} \x1b[0m`);

	next();
};
