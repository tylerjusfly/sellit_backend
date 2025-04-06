import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity.js';

@Entity({ name: 'blacklists' })
export class BlackLists extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false })
	type!: string;

	@Column({ type: 'varchar', nullable: false })
	data!: string;

	@Column({ type: 'varchar', nullable: true })
	note!: string;

	@Column({ type: 'varchar', nullable: false })
	shop_id!: string;

}
