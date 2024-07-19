import { Request, Response } from 'express';
import { CustomRequest } from '../../middlewares/verifyauth';
import { handleBadRequest, handleError, handleSuccess } from '../../constants/response-handler';
import { ICreateOrder, TallOrders } from '../../interfaces/orders';
import { dataSource } from '../../database/dataSource';
import { Product } from '../../database/entites/product.entity';
import { Shop } from '../../database/entites/shop.entity';
import { uniqueID } from '../../utils/generateIds';
import { Orders } from '../../database/entites/orders.entity';
import { convertToSlug } from '../../utils/convertToSlug';
import moment from 'moment';
import { IPaginate } from '../../interfaces/pagination';
import { LogHelper } from '../../utils/LogHelper';
import { ORDER_STATUS } from '../../constants/result';
import { manipulateOrderItem } from '../../utils/order-helpers';
import { transporter } from '../../mail-providers/nodemailer';
import { sendOrderMail } from '../../mail-providers/sendordermail';
import { Coupon } from '../../database/entites/coupon.entity';

export const createOrder = async (req: CustomRequest, res: Response) => {
	try {
		const { productid, qty, payment_gateway, order_from, coupon }: ICreateOrder = req.body;

		if (!productid || !qty || !payment_gateway || !order_from) {
			return handleBadRequest(res, 400, 'all field is required');
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

		if (isProduct.amount <= 0) {
			return handleBadRequest(res, 400, 'product amount cannot be zero');
		}

		// find shop
		const isShop = await dataSource.getRepository(Shop).findOne({
			where: {
				slug: isProduct.shop_id.slug,
			},
			loadEagerRelations: true,
		});

		if (!isShop) {
			return handleBadRequest(res, 400, 'shop does not exist');
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

			transporter.sendMail(creditsMail, function (error, info) {
				if (error) {
					// Log error for unsent mail
					LogHelper.error(error);
				} else {
					// Mail sent successfully
					LogHelper.info('Email sent: ' + info.response);
				}
			});
		}

		// Create order

		let totalOrderAmount = qty * isProduct.amount;

		if (coupon && coupon !== '') {
			// find coupon
			const couponCode = await Coupon.findOne({
				where: {
					shop_id: `${isShop.id}`,
					coupon_code: coupon,
				},
			});

			if (couponCode && couponCode.max_use > couponCode.total_usage) {
				// do something
				const new_amount = qty * isProduct.amount;

				let discountRate = (couponCode.discount / 100).toFixed(2); //discount rate
				const discountedPrice = new_amount - new_amount * parseFloat(discountRate);

				totalOrderAmount = discountedPrice;
				couponCode.total_usage = couponCode.total_usage + 1
				couponCode.save()
			}
		}

		const createOrders = dataSource.getRepository(Orders).create({
			orderid: orderId,
			productid: productid,
			product_name: isProduct.name,
			qty,
			shop_id: isShop,
			shop_slug: isShop.slug,
			payment_gateway,
			order_from: order_from,
			total_amount: totalOrderAmount,
		});

		const result = await dataSource.getRepository(Orders).save(createOrders);

		return handleSuccess(res, result, 'created', 201, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const getOrderById = async (req: Request, res: Response) => {
	try {
		const { orderid }: { orderid?: string } = req.query;

		if (!orderid) {
			return handleBadRequest(res, 400, 'orderid is required');
		}

		const OrderData = await dataSource.getRepository(Orders).findOne({
			where: {
				orderid,
			},
			loadEagerRelations: true,
		});

		if (!OrderData) {
			return handleBadRequest(res, 400, 'order cannot be found');
		}

		return handleSuccess(res, OrderData, '', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const getAllOrder = async (req: CustomRequest, res: Response) => {
	try {
		const { shopid, page, limit, status, startDate, endDate }: TallOrders = req.query;

		if (!shopid) {
			return handleBadRequest(res, 400, 'shopid is required');
		}

		const page_limit = limit ? Number(limit) : 10;

		const offset = page ? (Number(page) - 1) * page_limit : 0;

		// find shop
		const isShop = await dataSource.getRepository(Shop).findOne({
			where: {
				id: shopid,
			},
		});

		if (!isShop) {
			return handleBadRequest(res, 400, 'shop does not exist');
		}

		// fetch all shop product
		const query = dataSource
			.getRepository(Orders)
			.createQueryBuilder('q')
			.select([
				'q.id',
				'q.orderid',
				'q.product_name',
				'q.total_amount',
				'q.created_at',
				'q.order_status',
				'q.payment_gateway',
			]);

		query.where('q.shop_id = :shopval', { shopval: shopid });

		if (status && status !== '') {
			query.andWhere('q.order_status = :status', { status });
		}

		if (startDate && startDate !== '') {
			const start = moment(startDate).toISOString();
			query.andWhere(`q.created_at >= '${start}'`);
		}
		if (endDate && endDate !== '') {
			const end = moment(endDate).toISOString();
			query.andWhere(`q.created_at <= '${end}'`);
		}

		const allOrders = await query
			.offset(offset)
			.limit(page_limit)
			.orderBy('q.created_at', 'DESC')
			.getMany();

		const orderCount = await query.getCount();

		const totalPages = Math.ceil(orderCount / page_limit);

		const paging: IPaginate = {
			totalItems: orderCount,
			currentPage: page ? Number(page) : 1,
			totalpages: totalPages,
			itemsPerPage: page_limit,
		};

		return handleSuccess(res, allOrders, '', 200, paging);
	} catch (error) {
		return handleError(res, error);
	}
};

export const approveOrder = async (req: CustomRequest, res: Response) => {
	try {
		const { orderid }: { orderid?: string } = req.query;

		if (!orderid) {
			return handleBadRequest(res, 400, 'orderid is required');
		}

		const OrderData = await dataSource.getRepository(Orders).findOne({
			where: {
				orderid,
			},
			loadEagerRelations: false,
		});

		if (!OrderData) {
			return handleBadRequest(res, 400, 'order cannot be found');
		}

		const manipulate_result = await manipulateOrderItem(OrderData.id, OrderData.productid);

		if (!manipulate_result) {
			return handleBadRequest(res, 400, 'failed to approve order');
		}

		// Send email to user about order
		await sendOrderMail(OrderData.id);

		return handleSuccess(res, '', '', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const disapproveOrder = async (req: CustomRequest, res: Response) => {
	try {
		const { orderid }: { orderid?: string } = req.query;

		if (!orderid) {
			return handleBadRequest(res, 400, 'orderid is required');
		}

		const OrderData = await dataSource.getRepository(Orders).findOne({
			where: {
				orderid,
			},
		});

		if (!OrderData) {
			return handleBadRequest(res, 400, 'order cannot be found');
		}

		OrderData.order_status = ORDER_STATUS.UNPAID;

		OrderData.save();

		return handleSuccess(res, OrderData, '', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};

export const getPopularPayment = async (req: CustomRequest, res: Response) => {
	try {
		const shopid = req.query.shopid as any;
		// find shop
		const isShop = await dataSource.getRepository(Shop).findOne({
			where: {
				id: shopid,
			},
			// loadEagerRelations: true,
		});

		if (!isShop) {
			return handleBadRequest(res, 400, 'shop does not exist');
		}

		// fetch orders by shop
		const ordersGroupedByPaymentGateway = await Orders.createQueryBuilder('order')
			.select('order.payment_gateway', 'payment_gateway')
			.where('order.shop_id = :shopId', { shopId: shopid })
			.addSelect('COUNT(order.id)', 'order_count')
			.groupBy('order.payment_gateway')
			.orderBy('order_count', 'DESC')
			.getRawMany();

		return handleSuccess(res, ordersGroupedByPaymentGateway, '', 200, undefined);
	} catch (error) {
		return handleError(res, error);
	}
};
