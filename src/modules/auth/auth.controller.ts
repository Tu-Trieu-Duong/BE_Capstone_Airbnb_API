import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { Public } from 'src/common/decorator/is-public.decorator';
import { SigninDto } from './dto/signin.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @ApiBearerAuth()
  @Post('refresh-token')
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body);
  }
}
