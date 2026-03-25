import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称', example: '电子产品' })
  @IsString()
  @IsNotEmpty({ message: '分类名称不能为空' })
  name: string;

  @ApiPropertyOptional({ description: '分类描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '父分类ID' })
  @IsOptional()
  @IsString()
  parent?: string;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '是否启用', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}