import { Response } from "express";
import { handleBadRequest, handleError, handleSuccess } from "../../constants/response-handler";
import { CustomRequest } from "../../middlewares/verifyauth";
import { cJwtPayload } from "../../utils/token-helper";
import { dataSource } from "../../database/dataSource";
import { Store } from "../../database/entites/store.entity";

export const getshopdata = async (req: CustomRequest, res: Response) => {
    try {
        const userReq = req.user as cJwtPayload;

        const query = dataSource.getRepository(Store).createQueryBuilder('q').select([
            "q.id",
            "q.storename",
            "q.display_picture",
            "q.domain_name",
            "q.hero_text",
        ])

        query.where('q.id = :val', { val: userReq.id });

        const StoreData = await query.getOneOrFail()

        return handleSuccess(res, StoreData, 'store', 200, undefined);
    } catch (error) {
        return handleError(res, error|| {message: 'Error finding store'});
    }
};

export const updateStorename = async (req: CustomRequest, res: Response) => {
	try {
		const { storename } = req.body;
		const storeReq = req.user as cJwtPayload;

		// Perform update only if there is valid data
		await dataSource.getRepository(Store).update(
			{ id: storeReq.id }, // Condition
			{ storename: storename, domain_name: `${storename}.sellit.app` }
		);

		return handleSuccess(res, {}, 'Store updated successfully', 200, undefined);
	} catch (error) {
		return handleError(res, error || { message: 'Error updating store' });
	}
};

export const getstoreInPublic = async (req: CustomRequest, res: Response) => {
	const { storename } = req.query;
	try {
		const query = dataSource
			.getRepository(Store)
			.createQueryBuilder('q')
			.leftJoinAndSelect('q.customization', 'customization')
			.select(['q.id', 'q.storename', 'q.display_picture', 'q.domain_name', 'q.hero_text']);

		query.where('q.storename = :val', { val: storename });

		const StoreData = await query.getOneOrFail();

		// StoreData.customization = StoreData.customization || null;

		res.setHeader('Cache-Control', 'public, max-age=10');

		return handleSuccess(res, StoreData, 'store', 200, undefined);
	} catch (error) {
		return handleError(res, error || { message: 'Error finding store' });
	}
};