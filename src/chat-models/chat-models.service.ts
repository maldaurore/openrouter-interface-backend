import { Injectable } from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model as ModelClass, ModelDocument } from './schemas/model.schema';
import { Model } from 'mongoose';

@Injectable()
export class ModelsService {
  constructor(
    @InjectModel(ModelClass.name) private modelModel: Model<ModelDocument>,
  ) {}

  async create(createModelDto: CreateModelDto): Promise<ModelClass> {
    const created = new this.modelModel(createModelDto);
    return await created.save();
  }

  async findAll(): Promise<ModelClass[]> {
    return this.modelModel.find().exec();
  }

  async findOne(_id: string): Promise<ModelClass | null> {
    return this.modelModel.findById(_id).exec();
  }

  async findByModelId(modelId: string): Promise<ModelClass | null> {
    return this.modelModel.findOne({ modelId });
  }

  async findAllModels(): Promise<ModelClass[]> {
    return this.modelModel.find().exec();
  }
}
