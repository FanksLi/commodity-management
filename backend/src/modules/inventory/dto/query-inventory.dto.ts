import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class QueryInventoryDto {
  @ApiPropertyOptional({ description: '商品ID' })
  @IsOptional()
  @IsString()
  product?: string;

  @ApiPropertyOptional({ description: '供应商ID' })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiPropertyOptional({
    description: '操作类型',
    enum: ['in', 'out', 'adjust', 'transfer'],
  })
  @IsOptional()
  @IsEnum(['in', 'out', 'adjust', 'transfer'])
  type?: string;

  @ApiPropertyOptional({ description: '批次号' })
  @IsOptional()
  @IsString()
  batchNo?: string;

  @ApiPropertyOptional({
    description: '关联类型',
    enum: ['purchase', 'sale', 'return', 'adjustment', 'transfer'],
  })
  @IsOptional()
  @IsEnum(['purchase', 'sale', 'return', 'adjustment', 'transfer'])
  relatedType?: string;

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

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
}