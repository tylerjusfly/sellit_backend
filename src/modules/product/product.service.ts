import { Response, Request } from 'express';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { GenerateProductId } from '../../utils/generateIds';
import { dataSource } from '../../database/dataSource';
import { Shop } from '../../database/entites/shop.entity';
import { Product } from '../../database/entites/product.entity';
import { IEditProduct } from '../../interfaces/product';
import { CustomRequest } from '../../middlewares/verifyauth';
import { ITokenPayload } from '../../utils/token-helper';

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

export const editProduct = async (req: CustomRequest, res: Response) => {
	try {
		const { id, stripeEnabled, unlisted, ...restData }: IEditProduct = req.body;

		const productObj = await Product.findOne({
			where: {
				id,
			},
		});

		if (!productObj) {
			return handleBadRequest(res, 404, 'product does not exist');
		}

		// Start update
		if (unlisted) {
			productObj.unlisted = unlisted === '1' ? true : false;
		}
		if (restData.productPrice) {
			productObj.amount = restData.productPrice;
		}

		if (restData.description && restData.description !== '') {
			productObj.description = restData.description;
		}
		if (restData.productImage && restData.productImage !== '') {
			productObj.image_src = restData.productImage;
		}

		const user = req.user as ITokenPayload;

		productObj.lastChanged_by = user.username;

		await productObj.save();

		return handleSuccess(res, productObj, 'updated product', 200, undefined);
	} catch (error) {
		handleError(res, error);
	}
};

export const getSpecificProduct = async (req: Request, res: Response) => {
	try {
		const { uniqueId, id }: { uniqueId?: string; id?: string } = req.query;

		if (!uniqueId && !id) {
			return handleBadRequest(res, 400, 'unique id / id is required');
		}

		if (uniqueId && uniqueId !== '') {
			const foundProduct = await Product.findOne({
				where: {
					unique_id: uniqueId,
				},
			});

			if (!foundProduct) {
				return handleBadRequest(res, 404, 'product does not exist');
			}

			return handleSuccess(res, foundProduct, 'found', 200, undefined);
		}

		if (id && id !== '') {
			const foundProduct = await Product.findOne({
				where: {
					id: parseInt(id),
				},
			});

			if (!foundProduct) {
				return handleBadRequest(res, 404, 'product does not exist');
			}

			return handleSuccess(res, foundProduct, 'found', 200, undefined);
		}
	} catch (error) {
		handleError(res, error);
	}
};
