import { ORDER_STATUS } from '../constants/result';
import { dataSource } from '../database/dataSource';
import { Orders } from '../database/entites/orders.entity';
import { Product } from '../database/entites/product.entity';
import { LogHelper } from './LogHelper';

function removeId(stockId: string, quantity: number) {
	let allstockArray = stockId.split(',');

	const productBought = allstockArray.splice(0, quantity).join(',');
	const newStock = allstockArray.join(',');
	return { productBought, newStock };
}

export const manipulateOrderItem = async (orderid: number, productid: string) => {
	// find order
	const orderData = await dataSource.getRepository(Orders).findOne({
		where: {
			id: orderid,
		},
	});

	if (!orderData) {
		return false;
	}

	const prodsData = await dataSource.getRepository(Product).findOne({
		where: {
			unique_id: productid,
		},
	});

	if (!prodsData) {
		return false;
	}

	// if items is already in an order , do not add
	if (orderData.items === null) {
		if (prodsData.items.split(',').length) {
			const orderItems = removeId(prodsData.items, orderData.qty);
			LogHelper.debug(orderItems);
			prodsData.items = orderItems.newStock;
			orderData.items = orderItems.productBought;
			orderData.order_status = ORDER_STATUS.PAID;

			await prodsData.save();
			await orderData.save();
		}
	}

	return true;
};
