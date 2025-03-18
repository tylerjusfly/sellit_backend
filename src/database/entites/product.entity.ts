import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	RelationId,
} from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';
import { Coupon } from './coupon.entity';
import { Store } from './store.entity';
import { Categories } from './categories.entity';

@Entity({ name: 'products' })
export class Product extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false })
	name!: string;

	@Column({ type: 'varchar', nullable: true })
	description!: string;

	@ManyToOne(() => Store, { nullable: false, eager: true })
	@JoinColumn({ name: 'shop_id' })
	shop_id!: Store;

	@Column({ type: 'varchar', nullable: true, default: '/imgs/products/attachment.png' })
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
	coinbase_key!: boolean;

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

	@ManyToOne(() => Categories, { nullable: true, eager: true, onDelete: 'SET NULL' })
	@JoinColumn({ name: 'categoryid' })
	@RelationId((product: Product) => product.categoryid)
	categoryid!: Categories;

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
