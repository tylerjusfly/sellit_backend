import express from 'express';
import type { Request, Response } from 'express';

import { initialiseDataSource } from './database/dataSource.js';
import { LogHelper } from './utils/LogHelper.js';
import cors from 'cors';
import { apiRouter } from './modules/router.js';
import { requsetLogger } from './middlewares/requestlogger.js';
// import { cacheRedisClient } from './database/redis/redis-client';
// import { rateLimiter } from './middlewares/rate-limiter';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

initialiseDataSource().then((isInitialised: boolean) => {
	if (isInitialised) {
		LogHelper.log(`DataSource has been initialised!`);
	} else {
		LogHelper.error(`Could not initialise database connection`);
	}
});

// cacheRedisClient
// 	.connect()
// 	.then(() => {
// 		LogHelper.debug('Connected to redis');
// 	})
// 	.catch((e) => {
// 		LogHelper.error(`Could not connect to redis`, e);
// 	});

app.use(express.json());

app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		credentials: true,
	})
);

app.use(requsetLogger);
app.use(express.static(join(__dirname, '../public')));

// app.use(rateLimiter);
app.use('/', apiRouter);

app.get('/', async (req: Request, res: Response) => {
	return res.send('Hello test folder');
});

function genericErrorHandler(req: Request, res: Response) {
	res.status(404).json({ success: false, message: 'Sending requests to unknown destination.' });
}

app.listen(port, () => {
	LogHelper.info(`Server running at http://localhost:${port}`);
});

//The 404 Route (ALWAYS Keep this as the last route)
app.all('*', genericErrorHandler);
