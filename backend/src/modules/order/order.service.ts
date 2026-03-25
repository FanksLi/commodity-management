import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId?: string): Promise<Order> {
    const orderNo = await this.generateOrderNo(createOrderDto.type);

    const items = createOrderDto.items.map((item) => ({
      ...item,
      amount: item.quantity * item.unitPrice,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    const order = new this.orderModel({
      ...createOrderDto,
      orderNo,
      items,
      totalAmount,
      createdBy: userId,
    });

    return order.save();
  }

  private async generateOrderNo(type: string): Promise<string> {
    const prefix = type === 'purchase' ? 'PO' : type === 'sale' ? 'SO' : 'RO';
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

    const count = await this.orderModel.countDocuments({
      type,
      createdAt: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    });

    const seq = String(count + 1).padStart(4, '0');
    return `${prefix}${dateStr}${seq}`;
  }

  async findAll(query: QueryOrderDto) {
    const { page = 1, limit = 10, startDate, endDate, ...filters } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (filters.orderNo) {
      filter.orderNo = { $regex: filters.orderNo, $options: 'i' };
    }

    if (filters.type) {
      filter.type = filters.type;
    }

    if (filters.status) {
      filter.status = filters.status;
    }

    if (filters.supplier) {
      filter.supplier = filters.supplier;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .populate('supplier', 'name')
        .populate('createdBy', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.orderModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('supplier', 'name')
      .populate('createdBy', 'name')
      .exec();

    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    return order;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId?: string,
  ): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(
        id,
        { ...updateOrderDto, updatedBy: userId },
        { new: true },
      )
      .populate('supplier', 'name')
      .populate('createdBy', 'name')
      .exec();

    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    return order;
  }

  async remove(id: string): Promise<void> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (!['pending', 'cancelled'].includes(order.status)) {
      throw new BadRequestException('当前订单状态不允许删除');
    }

    await this.orderModel.findByIdAndDelete(id).exec();
  }

  async updateStatus(id: string, status: string, userId?: string): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(
        id,
        { status, updatedBy: userId },
        { new: true },
      )
      .populate('supplier', 'name')
      .exec();

    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    return order;
  }

  async getStatistics(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      todayOrders,
      todayAmount,
    ] = await Promise.all([
      this.orderModel.countDocuments(),
      this.orderModel.countDocuments({ status: 'pending' }),
      this.orderModel.countDocuments({ status: 'completed' }),
      this.orderModel.countDocuments({ createdAt: { $gte: today } }),
      this.orderModel.aggregate([
        { $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      todayOrders,
      todayAmount: todayAmount[0]?.total || 0,
    };
  }
}