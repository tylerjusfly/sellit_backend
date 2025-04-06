import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity.js';

@Entity({ name: 'tickets' })
export class Tickets extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false })
	message!: string;

	@Column({ type: 'varchar', nullable: false })
	order_id!: string;

	@Column({ type: 'varchar', nullable: false })
	piority!: string;

	@Column({ type: 'varchar', nullable: false })
	shop_id!: number;
}
