import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class QueryCategoryDto {
  @ApiPropertyOptional({ description: '分类名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '父分类ID' })
  @IsOptional()
  @IsString()
  parent?: string;

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  limit?: number;
}