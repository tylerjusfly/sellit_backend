// import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
// import { CustomBaseEntity } from '../custom-base.entity';
// import { Store } from './user.entity';

// @Entity({ name: 'shops' })
// export class Store extends CustomBaseEntity {
// 	@Column({ type: 'varchar', unique: true, nullable: false })
// 	name!: string;

// 	@Column({ type: 'varchar', unique: true, nullable: false })
// 	slug!: string;

// 	@Column({ type: 'varchar', default: 'USD' })
// 	currency_type!: string;

// 	@Column({ type: 'boolean', default: true })
// 	display_image!: boolean;

// 	@Column({ type: 'varchar', default: '/images/avatars/no-image.png' })
// 	image_src!: string;

// 	@Column({ type: 'varchar', nullable: true })
// 	discord_link!: string;

// 	@Column({ type: 'integer', nullable: false, default: 0 })
// 	shop_credit!: number;

// 	@Column({ type: 'varchar', nullable: true })
// 	custom_domain!: string;

// 	@ManyToOne(() => Store, { eager: true })
// 	@JoinColumn({ name: 'shop_owner' })
// 	shop_owner!: Store;

// 	// ALL PAYMENT ROW GOES UNDER HERE

// 	@Column({ type: 'varchar', nullable: true })
// 	stripe_key!: string | null;

// 	@Column({ type: 'varchar', nullable: true })
// 	coin_base_key!: string | null;

// 	// Store front vals
// 	@Column({ type: 'varchar', default: '' })
// 	store_text!: string;

// 	@Column({ type: 'varchar', default: 'monospace' })
// 	store_font!: string;
// }
