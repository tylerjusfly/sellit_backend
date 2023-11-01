export type TShopType = {
	name: string;
	slug: string;
	currency_type: 'USD' | 'NGN' | string;
	shop_credit: number;
};

export interface IShopPayload {
	username: string;
	user_type: string;
	id: number;
}
