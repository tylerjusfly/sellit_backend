import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';

@Entity({ name: 'blacklists' })
export class BlackLists extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false })
	type!: string;

	@Column({ type: 'varchar', nullable: false })
	data!: string;

	@Column({ type: 'varchar', nullable: false })
	note!: string;

	@Column({ type: 'varchar', nullable: false })
	shop_id!: number;

	// @Column({ type: 'varchar', nullable: false })
	// shop_name!: string;

	// @Column({ type: 'simple-array', nullable: true })
	// products!: string[];
}
