import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity.js';

@Entity({ name: 'notifications' })
export class Notification extends CustomBaseEntity {
    @Column({ type: 'varchar', nullable: false })
    store_id!: string;

    @Column({ type: 'varchar', nullable: false, default: "Sellit Notification" })
    title!: string;

    @Column({ type: 'varchar', nullable: false })
    message!: string;

    @Column({ type: 'varchar', nullable: false })
    type!: string;

    @Column({ type: 'boolean', nullable: false, default: false })
    read!: boolean;
}
