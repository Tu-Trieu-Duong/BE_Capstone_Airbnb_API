import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRES, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES, REFRESH_TOKEN_SECRET } from 'src/common/constant/app.constant';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService){}
  createTokens (userId: number) {
      if (!userId || typeof userId !== 'number') {
        throw new Error('Không có userId để tạo token');
      }
  
      const accessToken = this.jwt.sign({ userId: userId }, {
        expiresIn: ACCESS_TOKEN_EXPIRES, secret: ACCESS_TOKEN_SECRET,
      });
      const refreshToken = this.jwt.sign({ userId: userId },  {
        expiresIn: REFRESH_TOKEN_EXPIRES, secret: REFRESH_TOKEN_SECRET,
      });
  
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
    verifyAccessToken (token, ignoreExpiration = false) {
      return this.jwt.verify(token,  {
        ignoreExpiration: ignoreExpiration,
        secret: ACCESS_TOKEN_SECRET,
      });
    }
    verifyRefreshToken (token) {
      return this.jwt.verify(token, { secret: REFRESH_TOKEN_SECRET });
    }
}
