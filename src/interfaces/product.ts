export type IEditProduct = {
	id: number;
	name?: string;
	productImage?: string;
	productPrice?: number;
	description?: string;
	productType?: string;
	stripeEnabled?: '1' | '0';
	webhookUrl?: string;
	unlisted?: '1' | '0';
};
