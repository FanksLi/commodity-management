import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({ description: '商品ID' })
  @IsString()
  @IsNotEmpty({ message: '商品不能为空' })
  product: string;

  @ApiPropertyOptional({ description: '供应商ID' })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiProperty({
    description: '操作类型',
    enum: ['in', 'out', 'adjust', 'transfer'],
  })
  @IsEnum(['in', 'out', 'adjust', 'transfer'])
  type: string;

  @ApiProperty({ description: '数量（入库为正，出库为负）' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ description: '批次号' })
  @IsOptional()
  @IsString()
  batchNo?: string;

  @ApiPropertyOptional({ description: '关联订单ID' })
  @IsOptional()
  @IsString()
  relatedOrder?: string;

  @ApiPropertyOptional({
    description: '关联类型',
    enum: ['purchase', 'sale', 'return', 'adjustment', 'transfer'],
  })
  @IsOptional()
  @IsEnum(['purchase', 'sale', 'return', 'adjustment', 'transfer'])
  relatedType?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}