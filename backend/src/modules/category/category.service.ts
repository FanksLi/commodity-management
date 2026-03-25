import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId?: string,
  ): Promise<Category> {
    const existingCategory = await this.categoryModel.findOne({
      name: createCategoryDto.name,
      parent: createCategoryDto.parent || null,
    });
    if (existingCategory) {
      throw new ConflictException('同一层级下分类名称已存在');
    }

    let level = 1;
    if (createCategoryDto.parent) {
      const parent = await this.categoryModel.findById(createCategoryDto.parent);
      if (!parent) {
        throw new NotFoundException('父分类不存在');
      }
      level = parent.level + 1;
    }

    const category = new this.categoryModel({
      ...createCategoryDto,
      parent: createCategoryDto.parent || null,
      level,
      createdBy: userId,
    });

    return category.save();
  }

  async findAll(query: QueryCategoryDto) {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (filters.name) {
      filter.name = { $regex: filters.name, $options: 'i' };
    }
    if (filters.parent !== undefined) {
      filter.parent = filters.parent || null;
    }
    if (filters.isActive !== undefined) {
      filter.isActive = filters.isActive;
    }

    const [data, total] = await Promise.all([
      this.categoryModel
        .find(filter)
        .populate('parent', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ sort: 1, createdAt: -1 })
        .exec(),
      this.categoryModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findTree(): Promise<any[]> {
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ sort: 1, createdAt: 1 })
      .lean()
      .exec();

    return this.buildTree(categories, null);
  }

  private buildTree(categories: any[], parentId: any): any[] {
    return categories
      .filter((cat) => String(cat.parent) === String(parentId))
      .map((cat) => ({
        ...cat,
        children: this.buildTree(categories, cat._id),
      }));
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel
      .findById(id)
      .populate('parent', 'name')
      .exec();
    if (!category) {
      throw new NotFoundException('分类不存在');
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId?: string,
  ): Promise<Category> {
    if (updateCategoryDto.name || updateCategoryDto.parent !== undefined) {
      const category = await this.categoryModel.findById(id);
      if (!category) {
        throw new NotFoundException('分类不存在');
      }

      const existingCategory = await this.categoryModel.findOne({
        name: updateCategoryDto.name || category.name,
        parent: updateCategoryDto.parent !== undefined ? updateCategoryDto.parent : category.parent,
        _id: { $ne: id },
      });
      if (existingCategory) {
        throw new ConflictException('同一层级下分类名称已存在');
      }

      if (updateCategoryDto.parent === id) {
        throw new ConflictException('不能将自己设为父分类');
      }
    }

    const category = await this.categoryModel
      .findByIdAndUpdate(
        id,
        { ...updateCategoryDto, updatedBy: userId },
        { new: true },
      )
      .exec();

    if (!category) {
      throw new NotFoundException('分类不存在');
    }
    return category;
  }

  async remove(id: string): Promise<void> {
    const childrenCount = await this.categoryModel.countDocuments({ parent: id });
    if (childrenCount > 0) {
      throw new ConflictException('该分类下存在子分类，无法删除');
    }

    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('分类不存在');
    }
  }
}