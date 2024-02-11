import { Category } from 'src/category/entities/category.entity';
import { OrderProduct } from 'src/orders/entities/order-products.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Timestamp } from 'typeorm/driver/mongodb/bson.typings';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column()
  stock: number;

  @Column('simple-array')
  images: string[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  udatedAt: Timestamp;

  @ManyToOne(() => User, (user) => user.products)
  addedBy: User;

  @ManyToOne(() => Category, (cat) => cat.products)
  category: Category;

  @OneToMany(() => Review, (rev) => rev.product)
  reviews: Review[];

  @OneToMany(() => OrderProduct, (op) => op.product)
  products: OrderProduct[];
}
