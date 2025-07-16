import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model as ModelClass, ModelDocument } from './schemas/model.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ModelsService {
  constructor (
    private readonly usersService: UsersService,
    @InjectModel(ModelClass.name) private modelModel: Model<ModelDocument>
  ) {}

  async create(createModelDto: CreateModelDto): Promise<ModelClass> {
    const created = new this.modelModel(createModelDto);
    return await created.save();
  }

  async findAll(): Promise<ModelClass[]> {
    return this.modelModel.find().exec();
  }

  findOne(id: string) {
    return `This action returns a #${id} model`;
  }

  async findUserModels(userId: string): Promise<ModelClass[]> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`)
    }

    return await this.modelModel.find({_id: { $in: user.availableModels } }).exec();

  }

  update(id: number, updateModelDto: UpdateModelDto) {
    return `This action updates a #${id} model`;
  }

  remove(id: number) {
    return `This action removes a #${id} model`;
  }
}
