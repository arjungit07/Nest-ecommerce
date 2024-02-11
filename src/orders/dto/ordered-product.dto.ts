import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderProductDto {
  @IsNotEmpty({ message: 'Product cannot be empty' })
  id: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Product price should be number' },
  )
  @IsPositive({ message: 'Price cannot be negative' })
  product_unit_price: number;

  @IsNumber({}, { message: 'Quantity should be number' })
  @IsPositive({ message: 'Quantity  cannot be negative' })
  product_quantity: number;
}
