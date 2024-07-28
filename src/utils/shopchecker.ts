import { dataSource } from '../database/dataSource';
import { Shop } from '../database/entites/shop.entity';

export async function findShop(shop: number | undefined) {
	const isShop = await dataSource.getRepository(Shop).findOne({
		where: { id: shop },
	});

	return isShop;
}
