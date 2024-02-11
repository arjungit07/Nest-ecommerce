import { PartialType } from '@nestjs/mapped-types';
import { CategorySign } from './category-sign.dto';

export class UpgradeCategory extends PartialType(CategorySign) {}
