import { Response, Request } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { GenerateProductId } from '../../utils/generateIds';
import { dataSource } from '../../database/dataSource';
import { Shop } from '../../database/entites/shop.entity';
import { Product } from '../../database/entites/product.entity';

export const CreateProduct = async (req: Request, res: Response) => {
	try {
		const { productname, shopid } = req.body;

		if (!shopid || !productname) {
			return handleBadRequest(res, 400, 'shop id || product name is required');
		}

		const isShop = await dataSource
			.getRepository(Shop)
			.createQueryBuilder('shop')
			.where('shop.id = :id', { id: shopid })
			.getOne();

		if (!isShop) return handleBadRequest(res, 404, 'shop not found');

		// Generate new unique product ID
		const productID = GenerateProductId();

		// Create Product
		const createProductObj = dataSource.getRepository(Product).create({
			shop_id: shopid,
			unique_id: productID,
			name: productname,
		});

		const result = await dataSource.getRepository(Product).save(createProductObj);

		return handleSuccess(res, result, 'created product', 201, undefined);
	} catch (error) {
		handleError(res, error);
	}
};
