import { Column, CreateDateColumn, DeleteDateColumn, Entity } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';

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

	@Column({ type: 'integer', nullable: false, default: 0 })
	shop_credit!: number;

	@Column({ type: 'varchar', nullable: true })
	custom_domain!: string;

	@DeleteDateColumn({ type: 'timestamp', nullable: true })
	deleted_at!: Date;

	@Column({ type: 'varchar', length: 300, nullable: true })
	deleted_by!: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	created_at!: Date;
}
