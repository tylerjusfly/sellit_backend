import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';
import { Shop } from './shop.entity';
import { Coupon } from './coupon.entity';

@Entity({ name: 'products' })
export class Product extends CustomBaseEntity {
	@Column({ type: 'varchar', unique: true, nullable: false })
	name!: string;

	@Column({ type: 'varchar', unique: true, nullable: false })
	unique_id!: string;

	@ManyToOne(() => Shop, { nullable: true, eager: true })
	@JoinColumn({ name: 'shop_id' })
	shop_id!: Shop;

	@Column({ type: 'varchar', nullable: true })
	image_src!: string;

	@Column({ type: 'text', nullable: true })
	items!: string;

	@Column({ type: 'boolean', default: true })
	unlisted!: boolean;

	@Column({ type: 'float4', default: 0 })
	amount!: number;

	@Column({ type: 'varchar', nullable: true })
	description!: string;

	@ManyToOne(() => Coupon)
	@JoinColumn({ name: 'coupon_id' })
	coupon_id!: Coupon;
}
