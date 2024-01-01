import { NextFunction, Request, Response } from 'express';
import { cacheRedisClient } from '../database/redis/redis-client';
import { CustomRequest } from './verifyauth';
import { ITokenPayload } from '../utils/token-helper';
import moment from 'moment';

const RATELIMIT_DURATION_IN_SECONDS = 60;
const NUMBER_OF_ALLOWED_REQUEST = 5;

export const rateLimiter = async (req: CustomRequest, res: Response, next: NextFunction) => {
	const { id } = req.user as ITokenPayload;

	const currentTime = moment().unix();

	const result = await cacheRedisClient.hGetAll(`${id}`);

	/**Check if first request */
	if (Object.keys(result).length === 0) {
		await cacheRedisClient.hSet(id.toString(), {
			createdAt: currentTime,
			count: 1,
		});

		return next();
	}

	if (result) {
		let diff: number = (currentTime - Number(result['createdAt'])) as number;

		if (diff > RATELIMIT_DURATION_IN_SECONDS) {
			await cacheRedisClient.hSet(id.toString(), {
				createdAt: currentTime,
				count: 1,
			});
			return next();
		}
	}

	/**If count is greater */

	if (Number(result['count']) >= NUMBER_OF_ALLOWED_REQUEST) {
		return res.status(429).json({
			success: false,
			message: "Relax, that's too many request in 60 secs",
		});
	} else {
		await cacheRedisClient.hSet(id.toString(), {
			count: parseInt(result['count']) + 1,
		});
		return next();
	}
};
