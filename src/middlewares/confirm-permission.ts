import type { NextFunction, Response } from 'express';
import { handleBadRequest } from '../constants/response-handler.js';
import type { CustomRequest } from './verifyauth.js';
import type { ITokenPayload } from '../utils/token-helper.js';
import { Store } from '../database/entites/store.entity.js';

export const authorize = (requiredPermissions: string[]) => {
	return [
		async (req: CustomRequest, res: Response, next: NextFunction) => {
			const { id } = req.user as ITokenPayload;

			const userProfile = await Store.findOne({
				where: {
					id,
				},
			});

			// console.log(JSON.parse(userProfile?.permissions as string), 'userr');

			let permissions: string[] = [];

			/** copy all user permission */
			if (userProfile && userProfile?.permissions) {
				permissions = JSON.parse(userProfile.permissions);
			}

			if (permissions.length) {
				const hasRequiredPermissions = requiredPermissions.every((p) =>
					permissions.some((permission) => permission === p)
				);
				if (hasRequiredPermissions) {
					next();
				} else {
					return handleBadRequest(res, 400, 'insufficient-permissions');
				}
			} else {
				return handleBadRequest(res, 400, 'insufficient-permissions');
			}
		},
	];
};
