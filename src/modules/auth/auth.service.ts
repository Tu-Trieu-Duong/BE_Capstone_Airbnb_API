import { TokenService } from './../../common/token/token.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/signin.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async signup(body: SignupDto) {
    const { email, password, name, phone, birth_day, gender } = body;

    if (!email || !password) {
      throw new BadRequestException('Vui lòng điền đầy đủ thông tin đăng ký');
    }

    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    // Nếu user đã tồn tại và chưa bị xóa → báo lỗi
    if (existingUser && !existingUser.isDeleted) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    // Nếu user bị xóa mềm → khôi phục
    if (existingUser && existingUser.isDeleted) {
      const updatedUser = await this.prisma.users.update({
        where: { id: existingUser.id },
        data: {
          name,
          email,
          pass_word: bcrypt.hashSync(password, 10),
          phone,
          birth_day,
          gender,
          role: 'user',
          isDeleted: false,
          deletedAt: null,
          deletedBy: 0,
        },
      });

      const { pass_word: _, ...rest } = updatedUser;
      return {
        message: 'Khôi phục tài khoản và đăng ký lại thành công',
        user: rest,
      };
    }

    const userNew = await this.prisma.users.create({
      data: {
        name,
        email,
        pass_word: bcrypt.hashSync(password, 10),
        phone,
        birth_day,
        gender,
        role: 'user',
      },
    });

    const { pass_word: _, ...userWithoutPassword } = userNew;

    return {
      message: 'Đăng ký thành công',
      user: userWithoutPassword,
    };
  }

  async signin(body: SigninDto) {
    const { email, password } = body;

    const userExist = await this.prisma.users.findUnique({
      where: { email: email },
    });

    if (!userExist) {
      throw new BadRequestException('Người dùng chưa tồn tại');
    }

    if (userExist.isDeleted) {
      throw new BadRequestException('Tài khoản bị xóa');
    }

    const isPassword = bcrypt.compareSync(password, userExist.pass_word);

    if (!isPassword) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }
    const tokens = this.tokenService.createTokens(userExist.id);

    const { pass_word, ...userWithoutPassword } = userExist;
    return {
      message: 'Đăng nhập thành công',
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async refreshToken(body: RefreshTokenDto) {
    const { refreshToken } = body;
    if(!refreshToken) {
      throw new BadRequestException('Vui lòng nhập refresh-token');
    }
    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);
      const userId = payload.userId;

      if (!userId || typeof userId !== 'number') {
        throw new BadRequestException('Payload token không hợp lệ');
      }
      
      const tokens = this.tokenService.createTokens(userId);
      return {
        message: 'Làm mới token thành công',
        ...tokens,
      };
    } catch (error) {
      throw new BadRequestException('Refresh token không hợp lệ');
    }
    
  }
  
}
