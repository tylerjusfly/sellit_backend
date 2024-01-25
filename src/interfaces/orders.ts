export interface ICreateOrder {
	productid: string;
	qty: number;
	shop_slug: string;
	payment_gateway: string;
	platform_fee: string;
	order_from: string;
}
