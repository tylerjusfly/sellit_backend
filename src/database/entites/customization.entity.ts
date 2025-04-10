import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity.js';
import { Store } from './store.entity.js';

@Entity({ name: 'customizations' })
export class Customization extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false, default: '#7367f0' })
	main_color!: string;

	@Column({ type: 'varchar', nullable: true })
	hero_svg!: string;

	@OneToOne(() => Store, { nullable: false })
	@JoinColumn() //This makes `storeId` the foreign key
	store!: string;
}
