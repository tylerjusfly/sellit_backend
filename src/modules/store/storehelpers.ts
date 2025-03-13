import { dataSource } from '../../database/dataSource';
import { Store } from '../../database/entites/store.entity';

export const getStoreByStorename = async (storename: string): Promise<Store | null> => {
	const IsStore = await dataSource.getRepository(Store).findOne({
		where: {
			storename,
		},
	});

	return IsStore; // Pretend this is from a real DB
};

export const getStoreByEmail = async (email: string) => {
	const IsStore = await dataSource.getRepository(Store).findOne({
		where: {
			email,
		},
	});

	return IsStore; // Pretend this is from a real DB
};
