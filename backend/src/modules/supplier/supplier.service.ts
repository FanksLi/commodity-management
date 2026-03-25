import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier, SupplierDocument } from './schemas/supplier.schema';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { QuerySupplierDto } from './dto/query-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name)
    private supplierModel: Model<SupplierDocument>,
  ) {}

  async create(
    createSupplierDto: CreateSupplierDto,
    userId?: string,
  ): Promise<Supplier> {
    const existingSupplier = await this.supplierModel.findOne({
      name: createSupplierDto.name,
    });
    if (existingSupplier) {
      throw new ConflictException('供应商名称已存在');
    }

    if (createSupplierDto.code) {
      const existingCode = await this.supplierModel.findOne({
        code: createSupplierDto.code,
      });
      if (existingCode) {
        throw new ConflictException('供应商编码已存在');
      }
    }

    const supplier = new this.supplierModel({
      ...createSupplierDto,
      createdBy: userId,
    });

    return supplier.save();
  }

  async findAll(query: QuerySupplierDto) {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (filters.name) {
      filter.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.contact) {
      filter.contact = { $regex: filters.contact, $options: 'i' };
    }

    if (filters.phone) {
      filter.phone = { $regex: filters.phone, $options: 'i' };
    }

    if (filters.level) {
      filter.level = filters.level;
    }

    if (filters.isActive !== undefined) {
      filter.isActive = filters.isActive;
    }

    const [data, total] = await Promise.all([
      this.supplierModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.supplierModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierModel.findById(id).exec();
    if (!supplier) {
      throw new NotFoundException('供应商不存在');
    }
    return supplier;
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
    userId?: string,
  ): Promise<Supplier> {
    if (updateSupplierDto.name) {
      const existingSupplier = await this.supplierModel.findOne({
        name: updateSupplierDto.name,
        _id: { $ne: id },
      });
      if (existingSupplier) {
        throw new ConflictException('供应商名称已存在');
      }
    }

    if (updateSupplierDto.code) {
      const existingCode = await this.supplierModel.findOne({
        code: updateSupplierDto.code,
        _id: { $ne: id },
      });
      if (existingCode) {
        throw new ConflictException('供应商编码已存在');
      }
    }

    const supplier = await this.supplierModel
      .findByIdAndUpdate(
        id,
        { ...updateSupplierDto, updatedBy: userId },
        { new: true },
      )
      .exec();

    if (!supplier) {
      throw new NotFoundException('供应商不存在');
    }
    return supplier;
  }

  async remove(id: string): Promise<void> {
    const result = await this.supplierModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('供应商不存在');
    }
  }

  async getStatistics(): Promise<any> {
    const [total, activeCount, levelStats] = await Promise.all([
      this.supplierModel.countDocuments(),
      this.supplierModel.countDocuments({ isActive: true }),
      this.supplierModel.aggregate([
        { $group: { _id: '$level', count: { $sum: 1 } } },
      ]),
    ]);

    const levelCounts = levelStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return {
      total,
      activeCount,
      levelA: levelCounts['A'] || 0,
      levelB: levelCounts['B'] || 0,
      levelC: levelCounts['C'] || 0,
      levelD: levelCounts['D'] || 0,
    };
  }
}