export interface ICreateOrder {
	productid: string;
	qty: number;
	payment_gateway: string;
	platform_fee: string;
	order_from: string;
}
