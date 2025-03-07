import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  };

  async createUser(username: string, password: string, name: string) {

    const user = new this.userModel({ username, password, name });
    try {
      return await user.save();
    } catch (e) {
      console.error('Error al crear usuario', e);
      throw new HttpException('Error al crear usuario: ' + e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }
}
