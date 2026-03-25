import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({ description: '供应商名称', example: '华为技术有限公司' })
  @IsString()
  @IsNotEmpty({ message: '供应商名称不能为空' })
  name: string;

  @ApiPropertyOptional({ description: '供应商编码', example: 'SUP001' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: '联系人', example: '张三' })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiPropertyOptional({ description: '联系电话', example: '13800138000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'contact@example.com' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiPropertyOptional({ description: '地址', example: '深圳市南山区' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: '银行信息' })
  @IsOptional()
  @IsObject()
  bankInfo?: {
    bank?: string;
    account?: string;
    accountName?: string;
  };

  @ApiPropertyOptional({ description: '税号', example: '91440300MA5DXXX' })
  @IsOptional()
  @IsString()
  taxNumber?: string;

  @ApiPropertyOptional({ description: '供应品类', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({
    description: '供应商等级',
    enum: ['A', 'B', 'C', 'D'],
    default: 'C',
  })
  @IsOptional()
  @IsEnum(['A', 'B', 'C', 'D'])
  level?: string;

  @ApiPropertyOptional({ description: '是否启用', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}