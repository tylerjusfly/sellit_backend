export interface ICategories {
	category_name: string;
	shop_id: number;
}

export interface IgetAllCat {
	shop_id?: number;
	page?: number;
	limit?: number;
	value?: string;
}

export interface IeditCategories {
	category_name: string;
	category_postion: number;
	items: string[];
}