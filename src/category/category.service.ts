import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategorySign } from './dto/category-sign.dto';
import { User } from 'src/users/entities/user.entity';
// import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UpgradeCategory } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategory: CategorySign,
    currentUser: User,
  ): Promise<Category> {
    const category = this.categoryRepository.create(createCategory);
    category.addedBy = currentUser;
    return await this.categoryRepository.save(category);
  }

  async findOne(id: number): Promise<Category> {
    const category = this.categoryRepository.findOne({
      where: { id: id },
      relations: { addedBy: true },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
    if (!category) throw new NotFoundException();
    return category;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async update(
    id: number,
    fields: Partial<UpgradeCategory>,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('User not exist');
    }
    Object.assign(category, fields);
    return await this.categoryRepository.save(category);
  }
}
