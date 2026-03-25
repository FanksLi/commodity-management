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
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { QuerySupplierDto } from './dto/query-supplier.dto';
import { Roles, User, RolesGuard, JwtAuthGuard } from '../../common';

@ApiTags('供应商管理')
@ApiBearerAuth()
@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '创建供应商' })
  create(@Body() createSupplierDto: CreateSupplierDto, @User('id') userId: string) {
    return this.supplierService.create(createSupplierDto, userId);
  }

  @Get()
  @ApiOperation({ summary: '获取供应商列表' })
  findAll(@Query() query: QuerySupplierDto) {
    return this.supplierService.findAll(query);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取供应商统计' })
  getStatistics() {
    return this.supplierService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取供应商详情' })
  @ApiParam({ name: 'id', description: '供应商ID' })
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '更新供应商' })
  @ApiParam({ name: 'id', description: '供应商ID' })
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @User('id') userId: string,
  ) {
    return this.supplierService.update(id, updateSupplierDto, userId);
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '删除供应商' })
  @ApiParam({ name: 'id', description: '供应商ID' })
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}