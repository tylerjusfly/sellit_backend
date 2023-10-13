import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: 'varchar', unique: true, nullable: false })
	username!: string;

	@Column({ type: 'varchar' })
	fullname!: string;

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
	token!: string;

	@Column({ type: 'varchar', nullable: true })
	discord_link!: string;

	@Column({ nullable: false })
	password!: string;

	@Column({ nullable: false })
	salt!: string;
}
