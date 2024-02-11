import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Roles } from 'src/utility/common/user.role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  roles: Roles;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  udatedAt: Timestamp;

  @OneToMany(() => Category, (cat) => cat.addedBy)
  categories: Category[];

  @OneToMany(() => Product, (prod) => prod.addedBy)
  products: Product[];

  @OneToMany(() => Review, (rev) => rev.user)
  reviews: Review[];

  @OneToMany(() => Order, (ord) => ord.updatedBy)
  orderedBy: Order[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
