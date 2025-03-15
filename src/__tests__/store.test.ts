import { Store } from '../database/entites/store.entity';
import { getStoreByStorename } from '../modules/store/storehelpers';

jest.mock('../modules/store/storehelpers', () => ({
	getStoreByStorename: jest.fn().mockImplementation(async () => {
		const store = new Store();
		store.id = '1';
		store.storename = 'testshop';
		store.user_type = 'shop_admin';
		return store;
	}),
}));

describe('Store Entity', () => {
	test('should return a mocked store', async () => {
		const store = await getStoreByStorename('1');
		expect(store).toEqual({ id: '1', storename: 'testshop', user_type: 'shop_admin' });
	});

	test('should return an instance of store', async () => {
		const store = await getStoreByStorename('1');
		expect(store).toBeInstanceOf(Store);
	});
});

// const databaseTeardown = async () => {

// }

// jest.mock('../entities/store.entity', () => {
//     return {
//       Store: jest.fn().mockImplementation(() => ({
//         id: '1',
//         storename: 'Mocked Store',
//         user_type: 'shop_admin',
//         email: 'mocked@example.com',
//         parent_store: null,
//         telephone: '1234567890',
//         display_picture: null,
//         active: true,
//         token: null,
//         discord_link: null,
//         stripe_key: null,
//         password: 'hashedpassword',
//         salt: 'randomsalt',
//         permissions: ['product:read'],
//       })),
//     };
//   });
