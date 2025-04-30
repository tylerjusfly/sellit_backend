import { Column, Entity, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../custom-base.entity.js';
import { Product } from './product.entity.js';

@Entity({ name: 'productitems' })
export class ProductItems extends CustomBaseEntity {
    @Column({ type: 'text', nullable: false, unique: true })
    item!: string;

    @Column({ type: 'uuid', nullable: false })
    store_id!: string;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    product!: Product;

}