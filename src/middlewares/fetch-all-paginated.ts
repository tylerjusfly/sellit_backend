import type { Request, Response, NextFunction } from 'express';
import type { EntityTarget, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { handleBadRequest, handleError, handleSuccess } from '../constants/response-handler.js';
import { dataSource } from '../database/dataSource.js';
import type { IPaginate } from '../interfaces/pagination.js';
import { Store } from '../database/entites/store.entity.js';
import type { CustomRequest } from './verifyauth.js';
import type { ITokenPayload } from '../utils/token-helper.js';

export function createFetchMiddleware<T extends ObjectLiteral>(
	targetEntity: EntityTarget<T>,
	relationField: string
) {
	return async (req: CustomRequest, res: Response, next: NextFunction) => {
		try {
			const { page, limit }: { page?: number; limit?: number } = req.query;

			const shop_id = req.user as ITokenPayload;

			const page_limit = limit ? Number(limit) : 10;
			const offset = page ? (Number(page) - 1) * page_limit : 0;

			const shopRepository = dataSource.getRepository(Store);
			const isShop = await shopRepository
				.createQueryBuilder('shop')
				.where('shop.id = :id', { id: shop_id.id })
				.getOne();

			if (!isShop) return handleBadRequest(res, 404, 'shop not found');

			const targetRepository = dataSource.getRepository(targetEntity);
			const whereCondition: FindOptionsWhere<T> = {
				[relationField]: shop_id.id,
			} as FindOptionsWhere<T>;

			const [items, total] = await targetRepository.findAndCount({
				where: whereCondition,
				skip: offset,
				take: page_limit,
				// order: {created_at: 'DESC'}
			});

			const paging: IPaginate = {
				totalItems: total,
				currentPage: page ? Number(page) : 1,
				totalpages: Math.ceil(total / page_limit),
				itemsPerPage: page_limit,
			};

			return handleSuccess(res, items, ``, 200, paging);
		} catch (error) {
			return handleError(res, error);
		}
	};
}
