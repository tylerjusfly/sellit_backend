import { NextFunction, Response } from 'express';
import { handleBadRequest } from '../constants/response-handler';
import { CustomRequest } from './verifyauth';
import { ITokenPayload } from '../utils/token-helper';
import { User } from '../database/entites/user.entity';

export const authorize = (requiredPermissions: string[]) => {
	return [
		async (req: CustomRequest, res: Response, next: NextFunction) => {
			const { id } = req.user as ITokenPayload;

			const userProfile = await User.findOne({
				where: {
					id,
				},
			});

			console.log(JSON.parse(userProfile?.permissions as string), 'userr');

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
