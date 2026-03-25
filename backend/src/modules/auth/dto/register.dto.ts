import { IsString, IsNotEmpty, MinLength, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  password: string;

  @ApiProperty({ description: '姓名', example: '管理员' })
  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'admin@example.com' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiPropertyOptional({ description: '手机号', example: '13800138000' })
  @IsOptional()
  @IsString()
  phone?: string;
}