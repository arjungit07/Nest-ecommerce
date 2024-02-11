import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Should not be  empty' })
  @IsNumber()
  productId: number;

  @IsNotEmpty({ message: 'Should not be  empty' })
  @IsNumber({}, { message: 'should be number' })
  ratings: number;

  @IsNotEmpty({ message: 'Should not be  empty' })
  @IsString()
  comment: string;
}
