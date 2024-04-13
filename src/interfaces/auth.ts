export type TLogin = {
	username: string;
	password: string;
};

export type TCreate = {
	username: string;
	fullname: string;
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