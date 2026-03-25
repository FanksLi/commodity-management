import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { QueryInventoryDto } from './dto/query-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
  ) {}

  async create(
    createInventoryDto: CreateInventoryDto,
    userId?: string,
  ): Promise<Inventory> {
    const inventory = new this.inventoryModel({
      ...createInventoryDto,
      operator: userId,
    });

    return inventory.save();
  }

  async findAll(query: QueryInventoryDto) {
    const { page = 1, limit = 10, startDate, endDate, ...filters } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (filters.product) {
      filter.product = filters.product;
    }

    if (filters.supplier) {
      filter.supplier = filters.supplier;
    }

    if (filters.type) {
      filter.type = filters.type;
    }

    if (filters.batchNo) {
      filter.batchNo = { $regex: filters.batchNo, $options: 'i' };
    }

    if (filters.relatedType) {
      filter.relatedType = filters.relatedType;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.inventoryModel
        .find(filter)
        .populate('product', 'name sku')
        .populate('supplier', 'name')
        .populate('operator', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.inventoryModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryModel
      .findById(id)
      .populate('product', 'name sku')
      .populate('supplier', 'name')
      .populate('operator', 'name')
      .exec();

    if (!inventory) {
      throw new NotFoundException('库存记录不存在');
    }
    return inventory;
  }

  async getProductInventoryHistory(productId: string, query: any) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.inventoryModel
        .find({ product: productId })
        .populate('supplier', 'name')
        .populate('operator', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.inventoryModel.countDocuments({ product: productId }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStatistics(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalIn,
      totalOut,
      todayIn,
      todayOut,
    ] = await Promise.all([
      this.inventoryModel.countDocuments({ type: 'in' }),
      this.inventoryModel.countDocuments({ type: 'out' }),
      this.inventoryModel.countDocuments({ type: 'in', createdAt: { $gte: today } }),
      this.inventoryModel.countDocuments({ type: 'out', createdAt: { $gte: today } }),
    ]);

    return {
      totalIn,
      totalOut,
      todayIn,
      todayOut,
    };
  }
}