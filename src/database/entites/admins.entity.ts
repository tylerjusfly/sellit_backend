import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity.js';

@Entity({ name: 'admins' })
export class Admins extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false })
	name!: number;

	@Column({ type: 'varchar', nullable: false })
	admin_id!: string;

	@Column({ type: 'varchar', nullable: false })
	email!: string;

	@Column({ type: 'varchar', nullable: true })
	private_key!: number;

	@Column({ type: 'varchar', nullable: false })
	password!: string;

}
