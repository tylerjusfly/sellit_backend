export type ICreateOrder = {
	productid: string;
	qty: number;
	payment_gateway: string;
	platform_fee: string;
	order_from: string;
	coupon?:string
};

export type TallOrders = {
	shopid?: string;
	page?: number;
	limit?: number;
	status?: string;
	startDate?: string;
	endDate?: string;
};
