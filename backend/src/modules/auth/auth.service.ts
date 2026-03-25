import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const userDoc = user as UserDocument;
    const payload = {
      sub: userDoc._id.toString(),
      username: userDoc.username,
      roles: userDoc.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userDoc._id,
        username: userDoc.username,
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone,
        roles: userDoc.roles,
        avatar: userDoc.avatar,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    const userDoc = user as UserDocument;
    return {
      id: userDoc._id,
      username: userDoc.username,
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      roles: userDoc.roles,
    };
  }

  async validateUser(userId: string) {
    return this.userService.findOne(userId);
  }
}