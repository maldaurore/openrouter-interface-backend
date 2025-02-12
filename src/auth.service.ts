import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const USERS = [{ username: 'admin', password: bcrypt.hashSync('1234', 10) }];

@Injectable()
export class AuthService {
  async login(username: string, password: string) {
    const user = USERS.find((u) => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return { error: 'Usuario o contraseña incorrectos' };
    }
    const token = jwt.sign({ username }, 'secreto_super_seguro', { expiresIn: '1h' });
    return { token };
  }
}