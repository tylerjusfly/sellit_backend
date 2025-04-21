import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity.js';

@Entity({ name: 'tickets' })
export class Tickets extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false })
	title!: string;

	@Column({ type: 'varchar', nullable: false })
	order_id!: string;

	@Column({ type: 'varchar', nullable: false })
	email!: string;

	@Column({ type: 'boolean', nullable: false, default: false })
	resolved!: boolean;

	@Column({ type: 'varchar', nullable: false })
	shop_id!: string;
}
