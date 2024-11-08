import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';
import { Shop } from './shop.entity';
import { Coupon } from './coupon.entity';

@Entity({ name: 'products' })
export class Product extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false })
	name!: string;

	@Column({ type: 'varchar', unique: true, nullable: false })
	unique_id!: string;

	@ManyToOne(() => Shop, { nullable: false, eager: true })
	@JoinColumn({ name: 'shop_id' })
	shop_id!: Shop;

	// @Column({ name: 'shop_id', nullable: false })
	// shop_id!: Shop; // Assuming shop_id is a number type (adjust as needed)

	@Column({ type: 'varchar', nullable: true, default: '/images/products/attachment.png' })
	image_src!: string;

	@Column({ type: 'text', nullable: true })
	items!: string | null;

	@Column({ type: 'integer', default: 0 })
	stock!: number;

	@Column({ type: 'boolean', default: false })
	unlisted!: boolean;

	@Column({ type: 'boolean', default: true })
	paypal!: boolean;

	@Column({ type: 'boolean', default: true })
	stripe!: boolean;

	@Column({ type: 'boolean', default: true })
	crypto!: boolean;

	@Column({ type: 'boolean', default: true })
	cashapp!: boolean;

	@Column({ type: 'boolean', default: false })
	warranty!: boolean;

	@Column({ type: 'varchar', nullable: true })
	warranty_msg!: string;

	@Column({ type: 'varchar', nullable: false, default: 'Serial/Code' })
	product_type!: string;

	@Column({ type: 'float4', default: 0 })
	amount!: number;

	@Column({ type: 'varchar', nullable: true })
	service_info!: string;

	@Column({ type: 'varchar', nullable: true })
	description!: string;

	@Column({ type: 'integer', default: 10 })
	max_purchase!: number;

	@Column({ type: 'varchar', nullable: true })
	webhook_url!: string;

	@Column({ type: 'varchar', nullable: true })
	callback_url!: string;
}
