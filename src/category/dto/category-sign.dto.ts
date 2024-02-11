import { IsNotEmpty, IsString } from 'class-validator';

export class CategorySign {
  @IsNotEmpty({ message: 'title cannot be null' })
  @IsString({ message: 'Should be a string' })
  title: string;

  @IsNotEmpty({ message: 'description cannot be null' })
  @IsString({ message: 'Shuold be a description' })
  description: string;
}
