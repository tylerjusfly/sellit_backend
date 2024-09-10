import { Request, Response } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { convertToSlug } from '../../utils/convertToSlug';
import { dataSource } from '../../database/dataSource';
import { Shop } from '../../database/entites/shop.entity';
import { IPaginate } from '../../interfaces/pagination';
import { User } from '../../database/entites/user.entity';
import { CustomRequest } from '../../middlewares/verifyauth';
import { ITokenPayload } from '../../utils/token-helper';
import { Brackets } from 'typeorm';

type getQueryType = {
	page?: string;
	limit?: string;
	search?: string;
};

export const createShop = async (req: CustomRequest, res: Response) => {
	try {
		const { shopname }: { shopname: string } = req.body;
		if (!shopname) {
			return handleBadRequest(res, 400, 'shop name is required');
		}

		const slugged = convertToSlug(shopname);

		const userReq = req.user as ITokenPayload;

		const isShopOwner = await dataSource.getRepository(User).findOne({
			where: {
				id: userReq.id,
			},
		});

		if (!isShopOwner) {
			return handleBadRequest(res, 404, 'shop owner not found');
		}

		const IsShop = await dataSource.getRepository(Shop).findOne({
			where: {
				slug: slugged,
			},
		});

		if (IsShop) return handleBadRequest(res, 400, 'Shop Already Exist');

		const createShop = dataSource.getRepository(Shop).create({
			name: shopname,
			slug: slugged,
			shop_owner: isShopOwner,
		});

		const result = await dataSource.getRepository(Shop).save(createShop);

		return handleSuccess(res, result, 'created shop', 201, undefined);
	} catch (error) {
		return handleError(res, error);
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
		return handleError(res, error);
	}
};

export const getAllShops = async (req: CustomRequest, res: Response) => {
	try {
		const { page, limit, search }: getQueryType = req.query;

		const page_limit = limit ? Number(limit) : 10;

		const offset = page ? (Number(page) - 1) * page_limit : 0;

		const userReq = req.user as ITokenPayload;

		const isUser = await dataSource.getRepository(User).findOne({
			where: { id: userReq.id },
		});

		if (!isUser) return handleBadRequest(res, 404, 'user not found');

		const query = dataSource
			.getRepository(Shop)
			.createQueryBuilder('q')
			.leftJoinAndSelect('q.shop_owner', 'user')
			.where('q.shop_owner = :user', { user: isUser.id });

		if (search && search !== '') {
			query.andWhere(
				new Brackets((qb) => {
					qb.where('LOWER(q.name) Like :name', { name: `%${search.toLowerCase()}%` });
				})
			);
		}

		const AllShops = await query
			.offset(offset)
			.limit(page_limit)
			.orderBy('q.created_at', 'DESC')
			.getMany();

		const Shopcount = await query.getCount();

		const totalPages = Math.ceil(Shopcount / page_limit);

		const paging: IPaginate = {
			totalItems: Shopcount,
			currentPage: page ? Number(page) : 1,
			totalpages: totalPages,
			itemsPerPage: page_limit,
		};

		return handleSuccess(res, AllShops, `allshops`, 200, paging);
	} catch (error) {
		return handleError(res, error);
	}
};

export const authenticateShop = async (req: CustomRequest, res: Response) => {
	try {
		const { shopid }: { shopid?: number } = req.query;

		if (!shopid) {
			return handleBadRequest(res, 400, 'shop id is required');
		}

		const userReq = req.user as ITokenPayload;

		const isUser = await dataSource.getRepository(User).findOne({
			where: { id: userReq.id },
		});

		if (!isUser) return handleBadRequest(res, 404, 'user not found');

		const isShop = await dataSource
			.getRepository(Shop)
			.createQueryBuilder('shop')
			.leftJoinAndSelect('shop.shop_owner', 'user')
			.where('shop.id = :id', { id: shopid })
			.andWhere('shop.shop_owner = :user', { user: isUser.id })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		// If shop and user id exist authenticate shop
		// const shoptoken = getShopPayload(isShop);

		return handleSuccess(res, isShop, 'shop auth', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const shopEdit = async (req: CustomRequest, res: Response) => {
	try {
		const {
			shopid,
			shopname,
			store_text,
			store_font,
		}: { shopid: number; shopname: string; store_text: string; store_font: string } = req.body;

		const userReq = req.user as ITokenPayload;

		const isUser = await dataSource.getRepository(User).findOne({
			where: { id: userReq.id },
		});

		if (!isUser) return handleBadRequest(res, 404, 'user not found');

		const isShop = await dataSource.getRepository(Shop).findOne({
			where: { id: shopid },
		});

		if (!isShop) return handleBadRequest(res, 400, 'cannot find shop');

		if (shopname && shopname !== '') {
			isShop.name = shopname;
		}

		if (store_text && store_text !== '') {
			isShop.store_text = store_text;
		}

		if (store_font && store_font !== '') {
			isShop.store_font = store_font;
		}

		isShop.lastChanged_by = isUser.username;

		await isShop.save();

		const data = {
			id: isShop.id,
			name: isShop.name,
		};

		return handleSuccess(res, data, 'updated product', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const authenticateShopByname = async (req: Request, res: Response) => {
	try {
		const { shopname }: { shopname?: string } = req.query;

		if (!shopname) {
			return handleBadRequest(res, 400, 'shop name is required');
		}

		const slugged = convertToSlug(shopname);

		const isShop = await dataSource
			.getRepository(Shop)
			.createQueryBuilder('shop')
			.select([
				'shop.id',
				'shop.name',
				'shop.slug',
				'shop.display_image',
				'shop.image_src',
				'shop.shop_credit',
				'shop.store_text',
				'shop.store_font',
				'shop.discord_link',
				// 'shop.createdAt',
				// 'shop.updatedAt', // Add other fields you want to include
			])
			// .leftJoinAndSelect('shop.shop_owner', 'user')
			.where('shop.slug = :name', { name: slugged })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		return handleSuccess(res, isShop, 'shop auth', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};
