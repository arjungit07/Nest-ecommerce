import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategorySign } from './dto/category-sign.dto';
import { CurrentUser } from 'src/utility/decorators/custom-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/utility/guards/authentication-guard';
//  import { AuthorizationGuard } from 'src/utility/guards/authorization-guard';
import { Category } from './entities/category.entity';
import { UpgradeCategory } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createCatergory: CategorySign,
    @CurrentUser() currentUser: User,
  ): Promise<Category> {
    return await this.categoriesService.create(createCatergory, currentUser);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(+id);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategory: UpgradeCategory,
  ): Promise<Category> {
    return this.categoriesService.update(+id, updateCategory);
  }
}
