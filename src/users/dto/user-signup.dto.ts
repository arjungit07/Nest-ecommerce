import { IsNotEmpty, IsString } from 'class-validator';
import { UserSignIn } from './user-signin.dto';

export class UserSignup extends UserSignIn {
  @IsNotEmpty({ message: 'name cannot be null' })
  @IsString()
  name: string;
}
