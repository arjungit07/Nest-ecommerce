import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserSignIn {
  @IsNotEmpty({ message: 'email cannot be null' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'password cannot be null' })
  @MinLength(5, { message: 'Shuold be min length 5' })
  password: string;
}
