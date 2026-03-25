import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class QueryOrderDto {
  @ApiPropertyOptional({ description: '订单号' })
  @IsOptional()
  @IsString()
  orderNo?: string;

  @ApiPropertyOptional({
    description: '订单类型',
    enum: ['purchase', 'sale', 'return'],
  })
  @IsOptional()
  @IsEnum(['purchase', 'sale', 'return'])
  type?: string;

  @ApiPropertyOptional({
    description: '订单状态',
    enum: ['pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled'])
  status?: string;

  @ApiPropertyOptional({ description: '供应商ID' })
  @IsOptional()
  @IsString()
  supplier?: string;

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