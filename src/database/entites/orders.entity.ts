import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity.js';
import { Store } from './store.entity.js';
import { ORDER_STATUS } from '../../constants/result.js';
import { Product } from './product.entity.js';

@Entity({ name: 'orders' })
export class Orders extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false, default: '' })
	product_name!: string;

	@Column({ type: 'uuid', nullable: false })
	productid!: string;

	@Column({ type: 'float4', nullable: false, default: 0 })
	product_price!: number;

	@Column({ type: 'varchar', nullable: false })
	product_type!: string;

	@Column({ type: 'integer', nullable: false, default: 0 })
	qty!: number;

	@Column({ type: 'float4', default: 0 })
	total_amount!: number;

	@Column({ type: 'varchar', default: ORDER_STATUS.UNPAID })
	order_status!: string;

	@Column({ type: 'varchar', nullable: false })
	order_from!: string;

	@Column({ type: 'varchar', nullable: true })
	applied_coupon!: string | null;

	@Column({ type: 'integer', nullable: false, default: 0 })
	coupon_value!: number;

	@Column({ type: 'boolean', nullable: false, default: false })
	admin_approved!: boolean;

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
