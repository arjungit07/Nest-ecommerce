import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignup } from './dto/user-signup.dto';
import { UserSignIn } from './dto/user-signin.dto';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup(userSignUp: UserSignup): Promise<User> {
    const userExists = await this.findOneByEmail(userSignUp.email);
    if (userExists) throw new BadRequestException();
    userSignUp.password = await hash(userSignUp.password, 10);
    const user = this.userRepository.create(userSignUp);
    return await this.userRepository.save(user);
  }

  async signin(userSignIn: UserSignIn) {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('email=:email', { email: userSignIn.email })
      .getOne();
    if (!userExists) throw new BadRequestException('User not exist');
    const comparePassword = await compare(
      userSignIn.password,
      userExists.password,
    );
    if (!comparePassword) {
      throw new BadRequestException('Bad Credentisls');
    }
    delete userExists.password;
    return userExists;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
  async accessToken(user: User) {
    return sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.EXPIRES,
    });
  }
}
