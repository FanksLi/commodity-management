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
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Roles, User, RolesGuard, JwtAuthGuard } from '../../common';

@ApiTags('商品管理')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '创建商品' })
  create(@Body() createProductDto: CreateProductDto, @User('id') userId: string) {
    return this.productService.create(createProductDto, userId);
  }

  @Get()
  @ApiOperation({ summary: '获取商品列表' })
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取商品统计' })
  getStatistics() {
    return this.productService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取商品详情' })
  @ApiParam({ name: 'id', description: '商品ID' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '更新商品' })
  @ApiParam({ name: 'id', description: '商品ID' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User('id') userId: string,
  ) {
    return this.productService.update(id, updateProductDto, userId);
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '删除商品' })
  @ApiParam({ name: 'id', description: '商品ID' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Patch(':id/stock')
  @Roles('admin', 'manager', 'warehouse')
  @ApiOperation({ summary: '更新库存' })
  @ApiParam({ name: 'id', description: '商品ID' })
  @ApiQuery({ name: 'quantity', description: '库存变化量（正数为入库，负数为出库）' })
  updateStock(@Param('id') id: string, @Query('quantity') quantity: number) {
    return this.productService.updateStock(id, quantity);
  }

  @Post('batch/status')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '批量更新状态' })
  batchUpdateStatus(@Body() body: { ids: string[]; status: string }) {
    return this.productService.batchUpdateStatus(body.ids, body.status);
  }
}