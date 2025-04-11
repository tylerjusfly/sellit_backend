import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity.js';

@Entity({ name: 'coupons' })
export class Coupon extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false })
	shop_id!: string;

	@Column({ type: 'varchar', nullable: false })
	coupon_code!: string;

	@Column({ type: 'varchar', nullable: false, default: 'discount' })
	type!: string;

	@Column({ type: 'integer', nullable: false })
	coupon_value!: number;

	@Column({ type: 'varchar', nullable: true })
	payment_method!: string | null;

	@Column({ type: 'varchar', nullable: true })
	product_id!: string;

	@Column({ type: 'integer', default: 1 })
	max_use!: number;

	@Column({ type: 'integer', default: 0 })
	total_usage!: number;
}
