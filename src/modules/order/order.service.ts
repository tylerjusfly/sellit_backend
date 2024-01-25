import { Response } from 'express';
import { CustomRequest } from '../../middlewares/verifyauth';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { ICreateOrder } from '../../interfaces/orders';
import { dataSource } from '../../database/dataSource';
import { Product } from '../../database/entites/product.entity';
import { Shop } from '../../database/entites/shop.entity';
import { uniqueID } from '../../utils/generateIds';
import { Orders } from '../../database/entites/orders.entity';

export const createOrder = async (req: CustomRequest, res: Response) => {
	try {
		const { productid, qty, shop_slug, payment_gateway, order_from }: ICreateOrder = req.body;

		if (!productid || !qty || !shop_slug || !payment_gateway || !order_from) {
			return handleBadRequest(res, 400, 'all field is required');
		}

		// find shop
		const isShop = await dataSource.getRepository(Shop).findOne({
			where: {
				slug: shop_slug,
			},
		});

		if (!isShop) {
			return handleBadRequest(res, 400, 'shop does not exist');
		}

		// Find Product
		const isProduct = await dataSource.getRepository(Product).findOne({
			where: {
				unique_id: productid,
			},
		});

		if (!isProduct) {
			return handleBadRequest(res, 400, 'product does not exist');
		}

		// Create unique order id and calculate total amount
		const orderId = uniqueID(12);

		let shopcredit = isShop.shop_credit - 1;
		let shopowner = isShop.shop_owner;

		if (shopcredit < 5) {
			// Send mail
			const creditsMail = {
				from: 'admin.AnyBuy',
				to: shopowner.email,
				subject: 'Low credit',
				html: `<div>
            <p> Hello  ${shopowner.fullname} </p>
            <p> <h3> Your credits on ${isShop.name} is Running low, Please Recharge </h3></p>
            </div>`,
			};
		}

		// Create order

		const createOrders = dataSource.getRepository(Orders).create({
			orderid: orderId,
			productid: productid,
			product_name: isProduct.name,
			qty,
			shop_id: isShop,
			shop_slug: isShop.slug,
			payment_gateway,
			total_amount: qty * isProduct.amount,
		});

		const result = await dataSource.getRepository(Orders).save(createOrders);

		return handleSuccess(res, result, 'created', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};
