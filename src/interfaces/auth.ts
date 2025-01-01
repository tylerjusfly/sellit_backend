export type TLogin = {
	storename: string;
	password: string;
};

export type TCreate = {
	storename: string;
	email: string;
	password: string;
	discord_link?: string;
	telephone?: string;
	display_picture?: string;
};

export type TAdminLogin = {
	email: string;
	password: string;
};
export type TUserVerify = {
	email: string;
	code: string;
};