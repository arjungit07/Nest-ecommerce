import { Type } from 'class-transformer';
import { CreateShippingDto } from './create-ship.dto';
import { ValidateNested } from 'class-validator';
import { OrderProductDto } from './ordered-product.dto';

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shippingAddress: CreateShippingDto;

  @Type(() => OrderProductDto)
  @ValidateNested()
  orderedProducts: OrderProductDto[];
}
