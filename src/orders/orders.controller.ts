import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/utility/guards/authentication-guard';
import { CurrentUser } from 'src/utility/decorators/custom-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { AuthorizationGuard } from 'src/utility/guards/authorization-guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Roles } from 'src/utility/common/user.role.enum';
import { AuthRoles } from 'src/utility/decorators/authorize-role.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.ordersService.create(createOrderDto, currentUser);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findOne(+id);
  }

  @AuthRoles('admin')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.ordersService.update(+id, updateOrderStatusDto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
