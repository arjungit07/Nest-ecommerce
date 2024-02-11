import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderProduct } from './entities/order-products.entity';
import { Shipping } from './entities/shipping.entity';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/product.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enum/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly opRepository: Repository<OrderProduct>,
    private readonly productService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, currentUser: User) {
    console.log('Post Code', createOrderDto.shippingAddress);
    const shippingEntity = new Shipping();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new Order();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = currentUser;

    const orderTbl = await this.orderRepository.save(orderEntity);

    const opEntity: {
      order: Order;
      product: Product;
      product_quantity: number;
      product_unit_price: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = orderTbl;
      const product = await this.productService.findOne(
        createOrderDto.orderedProducts[i].id,
      );
      const product_quantity =
        createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderedProducts[i].product_unit_price;

      opEntity.push({
        order,
        product,
        product_quantity,
        product_unit_price,
      });
    }

    const op = await this.opRepository
      .createQueryBuilder()
      .insert()
      .into(OrderProduct)
      .values(opEntity)
      .execute();

    return await this.findOne(orderTbl.id);
  }
  async findAll() {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderStatusDto,
    currentUser: User,
  ) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException();

    if (
      order.status === OrderStatus.DELEIVERED ||
      order.status === OrderStatus.CANCELLED
    )
      throw new BadRequestException(`order already ${order.status}`);

    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderDto.status != OrderStatus.SHIPPED
    )
      throw new BadRequestException('Deleiver before shipped');

    if (
      updateOrderDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    ) {
      return order;
    }

    if (updateOrderDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    if (updateOrderDto.status === OrderStatus.DELEIVERED) {
      order.deleiverdAt = new Date();
    }

    order.status = updateOrderDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);

    if (updateOrderDto.status === OrderStatus.DELEIVERED) {
      await this.stockUpdate(order, OrderStatus.DELEIVERED);
    }

    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order: Order, status: string) {
    for (const op of order.products) {
      await this.productService.updateStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }
}
