export interface ICoupon {
	type: string;
	coupon_code: string;
	payment_method?: string;
	coupon_value: number;
	max_use: number;
}

export interface IeditCoupon {
	coupon_value: number;
	max_use: number;
	id: string;
	type: string;
	product_id: string;
	payment_method: string;
}