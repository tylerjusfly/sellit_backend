export interface ICoupon {
	shopid: string;
	coupon_code: string;
	discount: number;
}

export interface IeditCoupon {
	discount: string;
	max_use: string;
	items: string[];
}