export type TUserType = {
	id: number;
	username: string;
	fullname: string;
	email: string;
	telephone: string;
	display_picture: string;
	active: boolean;
	token: string | null;
	discord_link: string | null;
	password: string;
	salt: string;
	user_type: string;
};
