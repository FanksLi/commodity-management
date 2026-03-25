import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, userId?: string): Promise<Product> {
    const existingProduct = await this.productModel.findOne({
      sku: createProductDto.sku,
    });
    if (existingProduct) {
      throw new ConflictException('SKU编码已存在');
    }

    const product = new this.productModel({
      ...createProductDto,
      createdBy: userId,
    });

    return product.save();
  }

  async findAll(query: QueryProductDto) {
    const {
      page = 1,
      limit = 10,
      keyword,
      category,
      brand,
      status,
      minPrice,
      maxPrice,
      isLowStock,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { sku: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' };
    }

    if (status) {
      filter.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.sellingPrice = {};
      if (minPrice !== undefined) filter.sellingPrice.$gte = minPrice;
      if (maxPrice !== undefined) filter.sellingPrice.$lte = maxPrice;
    }

    if (isLowStock) {
      filter.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('category', 'name')
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category', 'name')
      .exec();
    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    return product;
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.productModel.findOne({ sku }).exec();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId?: string,
  ): Promise<Product> {
    if (updateProductDto.sku) {
      const existingProduct = await this.productModel.findOne({
        sku: updateProductDto.sku,
        _id: { $ne: id },
      });
      if (existingProduct) {
        throw new ConflictException('SKU编码已存在');
      }
    }

    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { ...updateProductDto, updatedBy: userId },
        { new: true },
      )
      .populate('category', 'name')
      .exec();

    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('商品不存在');
    }
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { $inc: { stock: quantity } },
        { new: true },
      )
      .exec();

    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    return product;
  }

  async batchUpdateStatus(ids: string[], status: string): Promise<any> {
    return this.productModel.updateMany(
      { _id: { $in: ids } },
      { $set: { status } },
    );
  }

  async getStatistics(): Promise<any> {
    const [
      total,
      activeCount,
      lowStockCount,
      inactiveCount,
    ] = await Promise.all([
      this.productModel.countDocuments(),
      this.productModel.countDocuments({ status: 'active' }),
      this.productModel.countDocuments({
        $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      }),
      this.productModel.countDocuments({ status: 'inactive' }),
    ]);

    return {
      total,
      activeCount,
      lowStockCount,
      inactiveCount,
    };
  }
}