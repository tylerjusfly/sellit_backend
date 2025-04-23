export type TShopType = {
	name: string;
	slug: string;
	currency_type: 'USD' | 'NGN' | string;
	shop_credit: number;
};

export interface IShopPayload {
	storename: string;
	user_type: string;
	id: number;
}

export type NotificationType = {
	create_ticket: boolean;
	reply_ticket: boolean;
};