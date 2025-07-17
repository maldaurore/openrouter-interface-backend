import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });

    return user;
  };

  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
    }
    return user;

  };

  async createUser(email: string, password: string, name: string): Promise<UserDocument> {

    const user = new this.userModel({ email, password, name, chats: [], availableModels: [] });
    try {
      return await user.save();
    } catch (e) {
      console.error('Error al crear usuario', e);
      throw new HttpException('Error al crear usuario: ' + e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }
}
