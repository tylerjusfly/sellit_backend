import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';

@Entity({ name: 'users' })
export class User extends CustomBaseEntity {
	@Column({ type: 'varchar', unique: true, nullable: false })
	storename!: string;

	@Column({ type: 'varchar', default: 'shop_admin' })
	user_type!: string;

	@Column({ type: 'varchar', unique: true, nullable: false })
	email!: string;

	@Column({ type: 'varchar', nullable: true })
	telephone!: string;

	@Column({ type: 'varchar', nullable: true })
	display_picture!: string;

	@Column({ type: 'boolean', default: false })
	active!: boolean;

	@Column({ type: 'varchar', nullable: true })
	token!: string | null;

	@Column({ type: 'varchar', nullable: true })
	discord_link!: string;

	@Column({ nullable: false })
	password!: string;

	@Column({ nullable: false })
	salt!: string;

	@Column({ type: 'simple-array', nullable: false, default: ['product:read'] })
	permissions!: string;
}
