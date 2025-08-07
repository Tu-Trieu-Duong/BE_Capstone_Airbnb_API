import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorator/is-public.decorator';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class ProtectGuard extends AuthGuard('protect') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('handleRequest', { err, user, info });
    if (info instanceof TokenExpiredError) {
      throw new ForbiddenException('Token hết hạn');
    }
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
