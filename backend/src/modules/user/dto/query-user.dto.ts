import { IsString, IsOptional, IsBoolean, IsArray, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryUserDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '是否激活' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: '角色' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  limit?: number;
}