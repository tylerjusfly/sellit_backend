import { ORDER_STATUS } from '../constants/result.js';
import { dataSource } from '../database/dataSource.js';
import { Orders } from '../database/entites/orders.entity.js';
import { Product } from '../database/entites/product.entity.js';
import { LogHelper } from './LogHelper.js';

function removeId(stockId: string, quantity: number) {
	let allstockArray: string[] = [];

	if (stockId !== null) {
		allstockArray = stockId.split(',');
	}

	const productBought = allstockArray.splice(0, quantity).join(',');
	const newStock = allstockArray.join(',');
	return { productBought, newStock };
}

export const manipulateOrderItem = async (orderid: string, productid: string) => {
	// find order
	const orderData = null;
	await dataSource.getRepository(Orders).findOne({
		where: {
			id: orderid,
		},
	});

	if (!orderData) {
		return false;
	}

	const prodsData = await dataSource.getRepository(Product).findOne({
		where: {
			id: productid,
		},
	});

	if (!prodsData) {
		return false;
	}
	// To make sure on person buys it at a time
	// SELECT available_seats FROM flights WHERE id = $1 FOR UPDATE

	// if items is already in an order , do not add
	// if (orderData.items === null) {
	// 	if (prodsData.items?.split(',').length) {
	// 		const orderItems = removeId(prodsData.items, orderData.qty);
	// 		LogHelper.debug(orderItems);
	// 		prodsData.items = orderItems.newStock ? orderItems.newStock : null;
	// 		orderData.items = orderItems.productBought ? orderItems.productBought : null;
	// 		orderData.order_status = ORDER_STATUS.PAID;

	// 		// Keep track of product stock
	// 		if (orderItems.newStock && orderItems.newStock !== '') {
	// 			const itemsArray = orderItems.newStock?.split(',').map((item) => item.trim());
	// 			prodsData.stock = itemsArray.length;
	// 		} else {
	// 			prodsData.stock = 0;
	// 		}

	// 		await prodsData.save();
	// 		await orderData.save();
	// 	}
	// }

	return true;
};


export const calculateDiscountedCost = (pcost: number, pdisc: number) => {
	const totalCost = pcost;
	const discount = (pdisc / 100) * totalCost;
	const finalCost = totalCost - discount;
	return finalCost;
};
