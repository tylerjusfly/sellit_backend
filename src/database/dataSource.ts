import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { ENV } from '../constants/env-variables.js';

dotenv.config();

const DATABASE_ENABLE_LOGGING = process.env.DATABASE_ENABLE_LOGGING === 'true';
const DATABASE_ENABLE_SYNC = process.env.DATABASE_ENABLE_SYNC === 'true';

export const dataSource = new DataSource({
	type: 'postgres',
	host: ENV.PG_HOST,
	port: ENV.PG_PORT,
	username: ENV.PG_USER,
	password: ENV.PG_PASSWORD,
	database: ENV.PG_DATABASE,
	entities: ['**/*.entity.ts'],
	logging: DATABASE_ENABLE_LOGGING,
	synchronize: DATABASE_ENABLE_SYNC,
});

const DATABASE_RETRY_COUNT = process.env.DATABASE_CONNECT_RETRY_COUNT
	? parseInt(process.env.DATABASE_CONNECT_RETRY_COUNT)
	: 5;

const DATABASE_RETRY_INTERVAL_MS = 5000;

export async function initialiseDataSource(retries = DATABASE_RETRY_COUNT): Promise<boolean> {
	return dataSource
		.initialize()
		.then(() => true)
		.catch((err) => {
			const remainingRetries = retries - 1;
			console.warn(`Could not connect to the database, retrying ${remainingRetries} more time(s)`);
			if (remainingRetries === 0) {
				console.error(`Error during Data Source initialisation:`, err);
				return false;
			}
			return new Promise((resolve) => {
				setTimeout(() => {
					initialiseDataSource(remainingRetries).then(resolve);
				}, DATABASE_RETRY_INTERVAL_MS);
			});
		});
}

// AppDataSource.initialize().then(async () => {
//     console.log("Database connected!");

//     const categoryRepo = AppDataSource.getRepository(Categories);
//     const exists = await categoryRepo.findOneBy({ name: "Default Category" });

//     if (!exists) {
//         const category = categoryRepo.create({ name: "Default Category" });
//         await categoryRepo.save(category);
//         console.log("Inserted default category.");
//     }
// }).catch(error => console.log(error));
