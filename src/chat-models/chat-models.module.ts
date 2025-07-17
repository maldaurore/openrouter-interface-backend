import { Module } from '@nestjs/common';
import { ModelsService } from './chat-models.service';
import { ModelsController } from './chat-models.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, ModelSchema } from './schemas/model.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Model.name, schema: ModelSchema }]),
    UsersModule
  ],
  controllers: [ModelsController],
  providers: [ModelsService],
  exports: [ModelsService]
})
export class ChatModelsModule {}