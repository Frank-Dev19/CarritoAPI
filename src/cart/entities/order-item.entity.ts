import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn({ name: 'idDetalle' })
  idDetalle: number;

  @Column({ name: 'idCarrito' })
  idCarrito: number;

  @Column({ name: 'idProducto' })
  idProducto: number;

  @Column({ length: 50, name: 'sku' })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio' })
  precio: number;

  @Column({ type: 'int', default: 1, name: 'cantidad' })
  cantidad: number;

  @Column({ type: 'text', name: 'imagen', nullable: true })
  imagen: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCarrito' })
  order: Order;
}
