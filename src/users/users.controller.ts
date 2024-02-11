import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignup } from './dto/user-signup.dto';
import { User } from './entities/user.entity';
import { UserSignIn } from './dto/user-signin.dto';
import { CurrentUser } from 'src/utility/decorators/custom-user.decorator';
import { AuthGuard } from 'src/utility/guards/authentication-guard';
import { AuthRoles } from 'src/utility/decorators/authorize-role.decorator';
import { Roles } from 'src/utility/common/user.role.enum';
import { AuthorizationGuard } from 'src/utility/guards/authorization-guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('signup')
  signup(@Body() body: UserSignup): Promise<User> {
    console.log(body);
    return this.usersService.signup(body);
  }

  @Post('signin')
  async signin(@Body() userSignIn: UserSignIn): Promise<{
    accessToken: string;
    user: User;
  }> {
    const user = await this.usersService.signin(userSignIn);
    const accessToken = await this.usersService.accessToken(user);
    return { accessToken, user };
  }

  @AuthRoles(Roles.ADMIN)
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Get('all')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('single/:id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }
  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
