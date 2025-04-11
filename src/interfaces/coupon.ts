export interface ICoupon {
	type: string;
	coupon_code: string;
	payment_method?: string;
	coupon_value: number;
	max_use: number;
}

export interface IeditCoupon {
	discount: string;
	max_use: string;
	items: string[];
}