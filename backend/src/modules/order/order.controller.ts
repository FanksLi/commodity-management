import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { Roles, User, RolesGuard, JwtAuthGuard } from '../../common';

@ApiTags('订单管理')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles('admin', 'manager', 'sales')
  @ApiOperation({ summary: '创建订单' })
  create(@Body() createOrderDto: CreateOrderDto, @User('id') userId: string) {
    return this.orderService.create(createOrderDto, userId);
  }

  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  findAll(@Query() query: QueryOrderDto) {
    return this.orderService.findAll(query);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取订单统计' })
  getStatistics() {
    return this.orderService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  @ApiParam({ name: 'id', description: '订单ID' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'manager', 'sales')
  @ApiOperation({ summary: '更新订单' })
  @ApiParam({ name: 'id', description: '订单ID' })
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @User('id') userId: string,
  ) {
    return this.orderService.update(id, updateOrderDto, userId);
  }

  @Patch(':id/status')
  @Roles('admin', 'manager', 'sales')
  @ApiOperation({ summary: '更新订单状态' })
  @ApiParam({ name: 'id', description: '订单ID' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @User('id') userId: string,
  ) {
    return this.orderService.updateStatus(id, body.status, userId);
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '删除订单' })
  @ApiParam({ name: 'id', description: '订单ID' })
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}