import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles, User, RolesGuard, JwtAuthGuard } from '../../common';

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: '创建用户' })
  create(@Body() createUserDto: CreateUserDto, @User('id') userId: string) {
    return this.userService.create(createUserDto, userId);
  }

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  @ApiParam({ name: 'id', description: '用户ID' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: '更新用户' })
  @ApiParam({ name: 'id', description: '用户ID' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User('id') userId: string,
  ) {
    return this.userService.update(id, updateUserDto, userId);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户ID' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/change-password')
  @ApiOperation({ summary: '修改密码' })
  @ApiParam({ name: 'id', description: '用户ID' })
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(
      id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}