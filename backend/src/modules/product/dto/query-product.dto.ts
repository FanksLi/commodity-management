import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class QueryProductDto {
  @ApiPropertyOptional({ description: '商品名称/SKU' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: '品牌' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ description: '状态', enum: ['draft', 'pending', 'active', 'inactive'] })
  @IsOptional()
  @IsEnum(['draft', 'pending', 'active', 'inactive'])
  status?: string;

  @ApiPropertyOptional({ description: '最小价格' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: '最大价格' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: '是否低库存' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isLowStock?: boolean;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: '排序字段', default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: '排序方向', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}