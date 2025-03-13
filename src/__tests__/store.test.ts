import { getStoreByStorename } from "../modules/store/storehelpers";

jest.mock("../modules/store/storehelpers", () => ({
    getStoreByStorename: jest.fn().mockResolvedValue({ id: 1, storename: 'testshop', user_type: "shop_admin" }),
  }));
    
  test('should return a mocked store', async () => {
    const store = await getStoreByStorename("1");
    expect(store).toEqual({ id: 1, storename: 'testshop', user_type: "shop_admin"  });  // ✅ Passes with mocked data
  });
//   test('should return a type of store', async () => {
//     const store = await getStoreByStorename("1");
//     expect(store).toMatchObject(type);
//   });
  

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
  