import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(username: string, password: string, name: string) {
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new HttpException('El nombre de usuario ya está en uso', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.createUser(username, hashedPassword, name);
  }

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Nombre de usuario o contraseña incorrectos', HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      id: user._id,
      name: user.name
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, 
        {
          secret: process.env.JWT_SECRET || 'zafiro_support_tickets_secret'
        }
      );

      const newPayload = {
        sub: payload.sub,
        username: payload.username,
      }
      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch (e) {
      throw new HttpException('Token de refresco inválido', HttpStatus.UNAUTHORIZED);
    }
  }

}