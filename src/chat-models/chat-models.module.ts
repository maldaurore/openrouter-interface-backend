import { Module } from '@nestjs/common';
import { ModelsService } from './chat-models.service';
import { ModelsController } from './chat-models.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, ModelSchema } from './schemas/model.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Model.name, schema: ModelSchema }]),
  ],
  controllers: [ModelsController],
  providers: [ModelsService],
  exports: [ModelsService],
})
export class ChatModelsModule {}
