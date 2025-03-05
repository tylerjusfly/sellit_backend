import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';
import { Shop } from './shop.entity';
import { Coupon } from './coupon.entity';
import { User } from './user.entity';

@Entity({ name: 'products' })
export class Product extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false })
	name!: string;

	@Column({ type: 'varchar', nullable: true })
	description!: string;

	@ManyToOne(() => User, { nullable: false, eager: true })
	@JoinColumn({ name: 'shop_id' })
	shop_id!: User;

	@Column({ type: 'varchar', nullable: true, default: '/images/products/attachment.png' })
	image_src!: string;

	@Column({ type: 'text', nullable: true })
	items!: string | null;

	@Column({ type: 'integer', default: 0 })
	stock!: number;

	@Column({ type: 'boolean', default: false })
	unlisted!: boolean;

	@Column({ type: 'boolean', default: false })
	paypal!: boolean;

	@Column({ type: 'boolean', default: false })
	stripe!: boolean;

	@Column({ type: 'boolean', default: false })
	crypto!: boolean;

	@Column({ type: 'boolean', default: false })
	cashapp!: boolean;

	@Column({ type: 'boolean', default: false })
	private_mode!: boolean;

	@Column({ type: 'boolean', default: false })
	warranty!: boolean;

	@Column({ type: 'varchar', nullable: true })
	warranty_msg!: string;

	@Column({ type: 'boolean', default: false })
	enable_youtube!: boolean;

	@Column({ type: 'varchar', nullable: true })
	video_url!: string;

	@Column({ type: 'varchar', nullable: false, default: 'serial' })
	product_type!: string;

	@Column({ type: 'varchar', nullable: false, default: 'all' })
	categoryid!: string;

	@Column({
		type: 'varchar',
		nullable: false,
		default: 'Thank You for Your Interest in Our Products!',
	})
	seller_message!: string;

	@Column({ type: 'float4', default: 0 })
	amount!: number;

	@Column({ type: 'varchar', nullable: true })
	service_info!: string;

	@Column({ type: 'integer', default: 10 })
	max_purchase!: number;

	@Column({ type: 'integer', default: 1 })
	min_purchase!: number;

	@Column({ type: 'varchar', nullable: true })
	webhook_url!: string;

	@Column({ type: 'varchar', nullable: true })
	callback_url!: string;
}
