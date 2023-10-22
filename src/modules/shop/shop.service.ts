import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { convertToSlug } from '../../utils/convertToSlug';
import { dataSource } from '../../database/dataSource';
import { Shop } from '../../database/entites/shop.entity';

export const createShop = async (req: Request, res: Response) => {
	try {
		const { shopname }: { shopname: string } = req.body;
		if (!shopname) {
			return handleBadRequest(res, 400, 'shop name is required');
		}

		const slugged = convertToSlug(shopname);

		const IsShop = await dataSource.getRepository(Shop).findOne({
			where: {
				slug: slugged,
			},
		});

		if (IsShop) return handleBadRequest(res, 400, 'Shop Already Exist');

		const createShop = dataSource.getRepository(Shop).create({
			name: shopname,
			slug: slugged,
		});

		const result = await dataSource.getRepository(Shop).save(createShop);

		return handleSuccess(res, result, 'created shop', 201, undefined);
	} catch (error) {
		handleError(res, error);
	}
};

export const deleteShop = async (req: Request, res: Response) => {
	try {
		const { uuid }: { uuid?: number } = req.query;

		if (!uuid) {
			return handleBadRequest(res, 400, 'shop id is required');
		}

		const isShop = await dataSource.getRepository(Shop).findOne({
			where: { id: uuid },
		});

		if (!isShop) return handleBadRequest(res, 400, 'cannot delete unexisting shop');

		await isShop.softRemove();

		return handleSuccess(res, null, 'shop dropped', 200, undefined);
	} catch (error) {
		handleError(res, error);
	}
};

export const getAllShops = async (req: Request, res: Response) => {
	try {
		const allShops = await dataSource.getRepository(Shop).findAndCount();

		return handleSuccess(
			res,
			{ data: allShops[0], count: allShops[1] },
			`allShops[1]`,
			200,
			undefined
		);
	} catch (error) {
		handleError(res, error);
	}
};
