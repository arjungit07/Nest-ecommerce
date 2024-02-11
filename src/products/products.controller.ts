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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/utility/guards/authentication-guard';
// import { AuthorizationGuard } from 'src/utility/guards/authorization-guard';
import { CurrentUser } from 'src/utility/decorators/custom-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Product } from './entities/product.entity';
import { AuthorizationGuard } from 'src/utility/guards/authorization-guard';
import { AuthRoles } from 'src/utility/decorators/authorize-role.decorator';
// import { AuthRoles } from 'src/utility/decorators/authorize-role.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @AuthRoles('admin')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: User,
  ) {
    return await this.productsService.create(createProductDto, currentUser);
  }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() currentUser: User,
  ): Promise<Product> {
    return this.productsService.update(+id, updateProductDto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
