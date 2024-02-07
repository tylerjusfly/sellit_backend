export type ICreateOrder = {
	productid: string;
	qty: number;
	payment_gateway: string;
	platform_fee: string;
	order_from: string;
};

export type TallOrders = { shopid?: number; page?: number; limit?: number };
