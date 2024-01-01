import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';

@Entity({ name: 'coupons' })
export class Coupon extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false })
	shop_id!: string;

	@Column({ type: 'varchar', nullable: false })
	coupon_code!: string;

	@Column({ type: 'integer', nullable: false })
	discount!: number;

	@Column({ type: 'integer', default: 1 })
	max_use!: number;

	@Column({ type: 'integer', default: 0 })
	total_usage!: number;

	@Column({ type: 'simple-array', nullable: true })
	items!: string[];
}
