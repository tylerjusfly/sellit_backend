import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity';
import { Store } from './store.entity';

@Entity({ name: 'customizations' })
export class Customization extends CustomBaseEntity {
	@Column({ type: 'varchar', nullable: false, default: '#7367f0' })
	main_color!: string;

	@Column({ type: 'varchar', nullable: true })
	hero_svg!: string;

	@OneToOne(() => Store, (store) => store.customization, { nullable: false })
	@JoinColumn() // This makes `storeId` the foreign key
	store!: string;
}
