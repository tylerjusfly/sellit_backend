import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';
import { Shop } from './shop.entity';

const ORDER_STATUS = {
	PENDING: 'pending',
	PAID: 'paid',
	UNPAID: 'unpaid',
};

@Entity({ name: 'orders' })
export class Orders extends CustomBaseEntity {
	@Column({ type: 'varchar', unique: true, nullable: false })
	orderid!: string;

	@Column({ type: 'varchar', nullable: false })
	productid!: string;

	@Column({ type: 'varchar', nullable: false })
	product_name!: string;

	@Column({ type: 'varchar', nullable: false })
	qty!: string;

	@Column({ type: 'float4', default: 0 })
	total_amount!: number;

	@Column({ type: 'varchar', default: ORDER_STATUS.PENDING })
	order_status!: string;

	@Column({ type: 'varchar', nullable: false })
	shop_slug!: string;

	@ManyToOne(() => Shop, { nullable: false })
	@JoinColumn({ name: 'shop_id' })
	shop_id!: Shop;
}
