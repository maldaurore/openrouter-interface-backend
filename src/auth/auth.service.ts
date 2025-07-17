import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { NewUserDto } from './dto/new-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(newUserDto: NewUserDto) {
    const existingUser = await this.usersService.findByEmail(newUserDto.email);
    if (existingUser) {
      throw new HttpException('El nombre de usuario ya está en uso', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(newUserDto.password, 10);
    return this.usersService.createUser(newUserDto.email, hashedPassword, newUserDto.name);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new HttpException('Nombre de usuario o contraseña incorrectos', HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: user._id, email: user.email };
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
          secret: process.env.JWT_SECRET
        }
      );

      const newPayload = {
        sub: payload.sub,
        email: payload.email,
      }
      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch (e) {
      throw new HttpException('Token de refresco inválido', HttpStatus.UNAUTHORIZED);
    }
  }

}