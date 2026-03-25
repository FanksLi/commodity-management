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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { Roles, User, RolesGuard, JwtAuthGuard } from '../../common';

@ApiTags('商品分类')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '创建分类' })
  create(@Body() createCategoryDto: CreateCategoryDto, @User('id') userId: string) {
    return this.categoryService.create(createCategoryDto, userId);
  }

  @Get()
  @ApiOperation({ summary: '获取分类列表' })
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoryService.findAll(query);
  }

  @Get('tree')
  @ApiOperation({ summary: '获取分类树' })
  findTree() {
    return this.categoryService.findTree();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取分类详情' })
  @ApiParam({ name: 'id', description: '分类ID' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '更新分类' })
  @ApiParam({ name: 'id', description: '分类ID' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User('id') userId: string,
  ) {
    return this.categoryService.update(id, updateCategoryDto, userId);
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '删除分类' })
  @ApiParam({ name: 'id', description: '分类ID' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}