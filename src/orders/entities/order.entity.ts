import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { User } from 'src/users/entities/user.entity';
import { Shipping } from './shipping.entity';
import { OrderProduct } from './order-products.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  orderedAt: Timestamp;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;

  @Column({ default: null })
  shippedAt: Date;

  @Column({ default: null })
  deleiverdAt: Date;

  @ManyToOne(() => User, (user) => user.orderedBy)
  updatedBy: User;

  @OneToOne(() => Shipping, (ship) => ship.order, { cascade: true })
  @JoinColumn()
  shippingAddress: Shipping;

  @OneToMany(() => OrderProduct, (op) => op.order, { cascade: true })
  products: OrderProduct[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
