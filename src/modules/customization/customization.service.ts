import type { Response, Request } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler.js';
import type { CustomRequest } from '../../middlewares/verifyauth.js';
import { dataSource } from '../../database/dataSource.js';
import { Customization } from '../../database/entites/customization.entity.js';
import type { ITokenPayload } from '../../utils/token-helper.js';
import { Store } from '../../database/entites/store.entity.js';

export const getCustomization = async (req: CustomRequest, res: Response) => {
	try {
		const storeReq = req.user as ITokenPayload;

		const customizeData = await dataSource
			.getRepository(Customization)
			.createQueryBuilder('customize')
			.select(['customize.id', 'customize.main_color', 'customize.hero_svg'])
			.where('customize.store = :val', { val: storeReq.id })
			.getOne();

		// const customizeData = await query.getOneOrFail()

		if (!customizeData) {
			return handleBadRequest(res, 404, 'customization does not exist');
		}

		return handleSuccess(res, customizeData, 'found', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const InitializeCustomization = async (req: CustomRequest, res: Response) => {
	try {
		const storeReq = req.user as ITokenPayload;

		const createdCustomize = dataSource.getRepository(Customization).create({
			store: storeReq.id,
			hero_svg: '/hero-img.svg',
		});

		await dataSource.getRepository(Customization).save(createdCustomize);

		await dataSource.getRepository(Store).update(
			{ id: storeReq.id }, // Condition
			{ customizationid: createdCustomize.id }
		);

		return handleSuccess(res, {}, 'created ', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const updateCustomization = async (req: CustomRequest, res: Response) => {
	const { Customizationid, main_color, hero_svg } = req.body;
	try {
		const storeReq = req.user as ITokenPayload;

		const updateData: Partial<Customization> = {};

		if (main_color && main_color !== '') {
			updateData.main_color = main_color;
		}

		if (hero_svg && hero_svg !== '') {
			updateData.hero_svg = hero_svg;
		}

		if (Object.keys(updateData).length === 0) {
			return handleBadRequest(res, 404, 'No valid fields provided for update');
		}

		await dataSource.getRepository(Customization).update(
			{ id: Customizationid }, // Condition
			{ main_color: main_color, hero_svg: hero_svg }
		);

		return handleSuccess(res, {}, 'Customization updated successfully', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};
