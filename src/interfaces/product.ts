export type IEditProduct = {
	id: string;
	name?: string;
	amount?: number;
	paypal: boolean;
	coinbase_key: boolean;
	cashapp: boolean;
	stripe: boolean;
	unlisted?: '1' | '0';
	webhook_url?: string;
	callback_url?: string;
	product_type?: string;
	description?: string;
	service_info?: string;
	items?: string;
	min_purchase?: number;
	max_purchase?: number;

	productImage?: string;
};

export type IgetAllProduct = {
	shopid?: string;
	page?: number;
	limit?: number;
	unlisted?: string;
	search?: string;
};


export type IStoreProduct = {
	shopname?: string;
	search?: string;
	category?: number;
	page?: number;
	limit?: number;
};

