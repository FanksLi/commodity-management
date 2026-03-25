import { IsString, IsOptional, IsNumber, IsEnum, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: '优惠金额' })
  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @ApiPropertyOptional({ description: '已支付金额' })
  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @ApiPropertyOptional({
    description: '订单状态',
    enum: ['pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled'])
  status?: string;

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