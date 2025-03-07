export interface ICategories {
	category_name: string;
	shop_id: string;
}

export interface IgetAllCategory {
	shop_id?: string;
	shop_name?: string;
}

export interface IeditCategories {
	category_name: string;
	category_postion: number;
	items: string[];
}