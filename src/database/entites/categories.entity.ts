import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity.js';

@Entity({ name: 'categories' })
export class Categories extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false })
	shop_id!: string;

	// @Column({ type: 'varchar', nullable: false })
	// category_id!: string;

	@Column({ type: 'varchar', nullable: false })
	category_name!: string;

	@Column({ type: 'integer', default: 1 })
	category_postion!: number;

	@Column({ type: 'varchar', nullable: false })
	shop_name!: string;
}
