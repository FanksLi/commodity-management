import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsObject,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProductVariantDto {
  @ApiProperty({ description: 'SKU编码' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ description: '规格名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '规格属性' })
  @IsObject()
  attributes: Record<string, string>;

  @ApiPropertyOptional({ description: '成本价' })
  @IsOptional()
  @IsNumber()
  costPrice?: number;

  @ApiPropertyOptional({ description: '销售价' })
  @IsOptional()
  @IsNumber()
  sellingPrice?: number;

  @ApiPropertyOptional({ description: '库存' })
  @IsOptional()
  @IsNumber()
  stock?: number;
}

export class CreateProductDto {
  @ApiProperty({ description: '商品名称', example: 'iPhone 15 Pro' })
  @IsString()
  @IsNotEmpty({ message: '商品名称不能为空' })
  name: string;

  @ApiProperty({ description: 'SKU编码', example: 'IPHONE-15-PRO-001' })
  @IsString()
  @IsNotEmpty({ message: 'SKU编码不能为空' })
  sku: string;

  @ApiProperty({ description: '分类ID' })
  @IsString()
  @IsNotEmpty({ message: '分类不能为空' })
  category: string;

  @ApiPropertyOptional({ description: '品牌' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ description: '型号' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '图片列表', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: '商品属性' })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @ApiPropertyOptional({ description: '商品规格参数' })
  @IsOptional()
  @IsObject()
  specifications?: Record<string, any>;

  @ApiPropertyOptional({ description: '规格变体', type: [ProductVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @ApiPropertyOptional({ description: '成本价', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({ description: '销售价', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sellingPrice?: number;

  @ApiPropertyOptional({ description: '市场价', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  marketPrice?: number;

  @ApiPropertyOptional({ description: '库存', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ description: '低库存阈值', default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @ApiPropertyOptional({ description: '状态', enum: ['draft', 'pending', 'active', 'inactive'], default: 'draft' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @IsNumber()
  sort?: number;
}