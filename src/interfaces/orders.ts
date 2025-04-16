export type ICreateOrder = {
	productid: string;
	qty: number;
	payment_gateway: string;
	platform_fee: string;
	order_from: string;
	coupon_id?: string;
	shopname?: string;
	device_type: string;
};

export type TallOrders = {
	shopid?: string;
	page?: number;
	limit?: number;
	status?: string;
	gateway?: string;
	startDate?: string;
	endDate?: string;
};
