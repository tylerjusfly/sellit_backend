import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';

@Entity({ name: 'coupons' })
export class Coupon extends CustomBaseEntity {
	@Column({ type: 'varchar', unique: true, nullable: false })
	coupon_id!: string;

	@Column({ type: 'varchar', nullable: false })
	shop_id!: string;

	@Column({ type: 'varchar', nullable: false })
	coupon_code!: string;

	@Column({ type: 'varchar', nullable: false })
	discount!: string;

	@Column({ type: 'integer', default: 1 })
	max_use!: number;

	@Column({ type: 'integer', default: 0 })
	total_usage!: number;
}
