import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chats.schema';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { OpenRouterProvider } from './providers/openai.provider';
import { ChatModelsModule } from 'src/chat-models/chat-models.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    ChatModelsModule,
  ],
  providers: [OpenRouterProvider, ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
