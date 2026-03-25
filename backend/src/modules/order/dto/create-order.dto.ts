import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ description: '商品ID' })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({ description: '商品名称' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ description: 'SKU编码' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ description: '数量' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: '单价' })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

class ShippingInfoDto {
  @ApiPropertyOptional({ description: '收货人' })
  @IsOptional()
  @IsString()
  receiver?: string;

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '收货地址' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: '物流单号' })
  @IsOptional()
  @IsString()
  trackingNo?: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: '订单类型',
    enum: ['purchase', 'sale', 'return'],
  })
  @IsEnum(['purchase', 'sale', 'return'])
  type: string;

  @ApiPropertyOptional({ description: '供应商ID（采购订单必填）' })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiProperty({ description: '订单商品', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({ description: '优惠金额', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiPropertyOptional({ description: '收货信息' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingInfoDto)
  shippingInfo?: ShippingInfoDto;
}