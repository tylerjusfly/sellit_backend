require('dotenv').config();

export const ENV = {
	COINBASE_KEY: process.env.COINBASE_KEY,
	FRONTEND_URL: process.env.FRONTEND_URL || 'https://buy-tylerjusfly.vercel.app',
};

// export const STRIPE_PRIMARY_KEY = process.env.STRIPE_PRIMARY;
