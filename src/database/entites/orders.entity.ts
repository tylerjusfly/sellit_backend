import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';
import { Shop } from './shop.entity';
import { ORDER_STATUS } from '../../constants/result';

@Entity({ name: 'orders' })
export class Orders extends CustomBaseEntity {
	@Column({ type: 'varchar', unique: true, nullable: false })
	orderid!: string;

	@Column({ type: 'varchar', nullable: false })
	productid!: string;

	@Column({ type: 'varchar', nullable: false })
	product_name!: string;

	@Column({ type: 'varchar', nullable: false })
	qty!: number;

	@Column({ type: 'float4', default: 0 })
	total_amount!: number;

	@Column({ type: 'varchar', default: ORDER_STATUS.UNPAID })
	order_status!: string;

	@Column({ type: 'varchar', nullable: false })
	order_from!: string;

	@Column({ type: 'varchar', nullable: false })
	shop_slug!: string;

	@Column({ type: 'varchar', nullable: false })
	payment_gateway!: string;

	@Column({ type: 'text', nullable: true })
	items!: string | null;

	@Column({ type: 'varchar', nullable: false, default: 0 })
	platform_fee!: string;

	@ManyToOne(() => Shop, { nullable: false, eager: true })
	@JoinColumn({ name: 'shop_id' })
	shop_id!: Shop;
}
