import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { username, password }) {
    return this.authService.login(username, password);
  }

  @Post('register')
  async register(@Body() { username, password, name }) {
    return this.authService.register(username, password, name);
  }
}
