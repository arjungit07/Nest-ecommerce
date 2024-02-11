import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'title cannot be empty' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'desc cannot be empty' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'price cannot be empty' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsNotEmpty({ message: 'price cannot be empty' })
  @IsNumber({}, { message: 'stock should be number' })
  @Min(0, { message: 'Cannot be IsNegative' })
  stock: number;

  @IsNotEmpty({ message: 'images cannot be empty' })
  @IsArray()
  images: string[];

  @IsNotEmpty({ message: 'category cannot be empty' })
  @IsNumber({}, { message: 'stock should be number' })
  categoryId: number;
}
