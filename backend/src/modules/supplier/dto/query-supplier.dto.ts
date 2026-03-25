import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class QuerySupplierDto {
  @ApiPropertyOptional({ description: '供应商名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '联系人' })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: '供应商等级',
    enum: ['A', 'B', 'C', 'D'],
  })
  @IsOptional()
  @IsEnum(['A', 'B', 'C', 'D'])
  level?: string;

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number;
}