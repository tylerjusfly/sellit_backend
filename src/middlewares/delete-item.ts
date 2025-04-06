import type { Request, Response, NextFunction } from 'express';
import type { EntityTarget, ObjectLiteral } from 'typeorm';
import { handleBadRequest, handleError, handleSuccess } from '../constants/response-handler.js';
import { dataSource } from '../database/dataSource.js';

export function deleteMiddleware<T extends ObjectLiteral>(entity: EntityTarget<T>) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { uuid }: { uuid?: number } = req.query;
			if (!uuid) {
				return handleBadRequest(res, 400, 'id is required');
			}

			const repository = dataSource.getRepository(entity);
			const item = await repository.findOne({
				where: { id: uuid } as any,
			});

			if (!item) {
				return handleBadRequest(res, 400, 'cannot delete non-existing item');
			}

			await repository.softRemove(item);

			// res.locals.deletedItem = item;
			// next();
			return handleSuccess(res, null, 'dropped', 200, undefined);
		} catch (error) {
			return handleError(res, error);
		}
	};
}
