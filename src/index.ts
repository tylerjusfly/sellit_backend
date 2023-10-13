import express, { Express, NextFunction, Request, Response } from 'express';
import { dataSource, initialiseDataSource } from './database/dataSource';
import { LogHelper } from './utils/LogHelper';
import cors from 'cors';
import { User } from './database/entites/user.entity';
import { apiRouter } from './modules/router';

const app = express();
const port = process.env.PORT || 4000;

initialiseDataSource().then((isInitialised: boolean) => {
	if (isInitialised) {
		LogHelper.log(`DataSource has been initialised!`);
	} else {
		LogHelper.error(`Could not initialise database connection`);
	}
});

app.use(express.json());

app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		credentials: true,
	})
);

app.use('/', apiRouter);

app.use(genericErrorHandler);

app.get('/', async (req: Request, res: Response) => {
	return res.send('Hello Express typescript');
});

function genericErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
	console.error('An unexpected error occurred', err);
	res.status(404).json({ success: false, message: 'Internal Sever Error' });
	return next();
}

app.listen(port, () => {
	LogHelper.info(`Server running at http://localhost:${port}`);
});
