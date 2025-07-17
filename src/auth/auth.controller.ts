import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { NewUserDto } from './dto/new-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() newUserDto: NewUserDto) {
    return this.authService.register(newUserDto);
  }

  @Post('refresh')
  async refresh(@Body() { refreshToken }) {
    return this.authService.refresh(refreshToken);
  }
}
