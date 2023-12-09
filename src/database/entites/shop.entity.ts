import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';
import { User } from './user.entity';

@Entity({ name: 'shops' })
export class Shop extends CustomBaseEntity {
	@Column({ type: 'varchar', unique: true, nullable: false })
	name!: string;

	@Column({ type: 'varchar', unique: true, nullable: false })
	slug!: string;

	@Column({ type: 'varchar', default: 'USD' })
	currency_type!: string;

	@Column({ type: 'boolean', default: true })
	display_image!: boolean;

	@Column({ type: 'varchar', default: '/Image/view.png' })
	image_src!: string;

	@Column({ type: 'varchar', nullable: true })
	discord_link!: string;

	@Column({ type: 'varchar', nullable: true })
	seller_btc!: string;

	@Column({ type: 'integer', nullable: false, default: 0 })
	shop_credit!: number;

	@Column({ type: 'varchar', nullable: true })
	custom_domain!: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'shop_owner' })
	shop_owner!: User;

	// @ManyToOne(() => User, (user) => user.id, { eager: true })
	// shop_owner!: User;
}
