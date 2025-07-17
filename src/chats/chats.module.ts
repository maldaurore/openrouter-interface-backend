import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chats.schema';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ModelChatHandler } from './handlers/ModelChatHander';
import { ChatHandlerFactory } from './handlers/ChatHandlerFactory';
import { AssistantChatHandler } from './handlers/AssistantChatHandler';
import { braianChatHandler } from './handlers/BraianChatHandler';
import { OpenAIProvider } from './providers/openai.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])
  ],
  providers: [
    OpenAIProvider,
    AssistantChatHandler,
    braianChatHandler,
    ModelChatHandler,
    ChatHandlerFactory,
    ChatsService
  ],
  controllers: [ChatsController],
})
export class ChatsModule {}