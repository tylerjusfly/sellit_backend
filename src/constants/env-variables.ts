import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
	COINBASE_KEY: process.env.COINBASE_KEY,
	FRONTEND_URL: process.env.FRONTEND_URL,
	STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
	EMAIL_SECRET: process.env.EMAIL_SECRET,
	EMAIL_USER: process.env.EMAIL_USER,

	// DATABASE
	PG_HOST: process.env.DATABASE_HOST,
	PG_USER: process.env.DATABASE_USER,
	PG_PASSWORD: process.env.DATABASE_PASSWORD,
	PG_DATABASE: process.env.DATABASE_NAME,
	PG_PORT: 5432,
};
