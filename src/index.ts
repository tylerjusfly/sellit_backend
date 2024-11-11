import express, { Express, NextFunction, Request, Response } from 'express';
import { dataSource, initialiseDataSource } from './database/dataSource';
import { LogHelper } from './utils/LogHelper';
import cors from 'cors';
// import { User } from './database/entites/user.entity';
import { apiRouter } from './modules/router';
import { requsetLogger } from './middlewares/requestlogger';
// import { cacheRedisClient } from './database/redis/redis-client';
// import { rateLimiter } from './middlewares/rate-limiter';
import { join } from 'path';

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

// app.engine('handlebars', engine({ extname: '.hbs' }));
// app.set('view engine', 'handlebars');
// app.set('views', join(__dirname, '../views'));

// app.use(rateLimiter);
app.use('/', apiRouter);


app.get('/', async (req: Request, res: Response) => {
	return res.send('Hello test folder');
});

function genericErrorHandler(req: Request, res: Response) {
	res.status(404).json({ success: false, message: 'Internal Sever Error' });
}

// app.use('*', genericErrorHandler);

app.listen(port, () => {
	LogHelper.info(`Server running at http://localhost:${port}`);
});

//The 404 Route (ALWAYS Keep this as the last route)
app.all('*', genericErrorHandler);