import { dataSource } from '../database/dataSource';
import { Store } from '../database/entites/shop.entity';

export async function findShop(shop: string | undefined) {
	const isShop = await dataSource.getRepository(Store).findOne({
		where: { id: shop },
	});

	return isShop;
}
