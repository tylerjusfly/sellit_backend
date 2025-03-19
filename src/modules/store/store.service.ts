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