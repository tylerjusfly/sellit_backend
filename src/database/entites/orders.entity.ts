import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';
import { Store } from './store.entity';
import { ORDER_STATUS } from '../../constants/result';
import { Product } from './product.entity';

@Entity({ name: 'orders' })
export class Orders extends CustomBaseEntity {
	@ManyToOne(() => Product, { nullable: false, eager: true })
	@JoinColumn({ name: 'productid' })
	productid!: Product;

	@Column({ type: 'varchar', nullable: false })
	qty!: number;

	@Column({ type: 'float4', default: 0 })
	total_amount!: number;

	@Column({ type: 'varchar', default: ORDER_STATUS.UNPAID })
	order_status!: string;

	@Column({ type: 'varchar', nullable: false })
	order_from!: string;

	@Column({ type: 'varchar', nullable: false })
	payment_gateway!: string;

	@Column({ type: 'text', nullable: true })
	items!: string | null;

	@Column({ type: 'varchar', nullable: false, default: 0 })
	platform_fee!: string;

	@ManyToOne(() => Store, { nullable: false, eager: true })
	@JoinColumn({ name: 'shop_id' })
	shop_id!: Store;
}
