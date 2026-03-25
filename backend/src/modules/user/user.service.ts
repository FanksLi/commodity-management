import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto, userId?: string): Promise<User> {
    const existingUser = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      createdBy: userId,
    });

    return user.save();
  }

  async findAll(query: QueryUserDto) {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (filters.username) {
      filter.username = { $regex: filters.username, $options: 'i' };
    }
    if (filters.name) {
      filter.name = { $regex: filters.name, $options: 'i' };
    }
    if (filters.email) {
      filter.email = filters.email;
    }
    if (filters.phone) {
      filter.phone = { $regex: filters.phone, $options: 'i' };
    }
    if (filters.isActive !== undefined) {
      filter.isActive = filters.isActive;
    }
    if (filters.roles && filters.roles.length > 0) {
      filter.roles = { $in: filters.roles };
    }

    const [data, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    userId?: string,
  ): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { ...updateUserDto, updatedBy: userId },
        { new: true },
      )
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('用户不存在');
    }
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new ConflictException('旧密码不正确');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    if (!user.isActive) {
      throw new ConflictException('用户已被禁用');
    }

    return user;
  }
}