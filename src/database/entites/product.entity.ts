import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';
import { Shop } from './shop.entity';

@Entity({ name: 'shops' })
export class Product extends CustomBaseEntity {
	@Column({ type: 'varchar', unique: true, nullable: false })
	name!: string;

	@Column({ type: 'varchar', unique: true, nullable: false })
	unique_id!: string;

	@ManyToOne(() => Shop)
	@JoinColumn({ name: 'shop_id' })
	shop_id!: Shop;

	@Column({ type: 'varchar', nullable: true })
	image_src!: string;

	@Column({ type: 'text' })
	items!: string;

	@Column({ type: 'boolean', default: true })
	unlisted!: boolean;

	@Column({ type: 'float4' })
	amount!: number;
}
