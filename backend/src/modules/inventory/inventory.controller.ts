import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { QueryInventoryDto } from './dto/query-inventory.dto';
import { Roles, User, RolesGuard, JwtAuthGuard } from '../../common';

@ApiTags('库存管理')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @Roles('admin', 'manager', 'warehouse')
  @ApiOperation({ summary: '创建库存记录' })
  create(@Body() createInventoryDto: CreateInventoryDto, @User('id') userId: string) {
    return this.inventoryService.create(createInventoryDto, userId);
  }

  @Get()
  @ApiOperation({ summary: '获取库存记录列表' })
  findAll(@Query() query: QueryInventoryDto) {
    return this.inventoryService.findAll(query);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取库存统计' })
  getStatistics() {
    return this.inventoryService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取库存记录详情' })
  @ApiParam({ name: 'id', description: '记录ID' })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Get('product/:productId/history')
  @ApiOperation({ summary: '获取商品库存历史' })
  @ApiParam({ name: 'productId', description: '商品ID' })
  getProductHistory(
    @Param('productId') productId: string,
    @Query() query: any,
  ) {
    return this.inventoryService.getProductInventoryHistory(productId, query);
  }
}