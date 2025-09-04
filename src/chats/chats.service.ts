import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chats.schema';
import mongoose, { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { Sender } from 'types';
import { GetResponseDto } from './dto/get-response.dto';
import { ModelsService } from 'src/chat-models/chat-models.service';
import {
  createOpenRouter,
  OpenRouterProvider,
} from '@openrouter/ai-sdk-provider';
import { generateText, ModelMessage } from 'ai';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @Inject('OPENROUTER_INSTANCE') private openRouter: OpenRouterProvider,
    private readonly chatModelsService: ModelsService,
  ) {
    this.openRouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }

  async getAllChats(): Promise<Chat[]> {
    return this.chatModel
      .find()
      .select('_id title createdAt')
      .sort({ createdAt: -1 })
      .exec();
  }

  async createChat(
    chatId: string,
    messages: Message[],
    model: string,
  ): Promise<Chat> {
    const inputMessages: ModelMessage[] = messages.map((message) => ({
      role: message.sender === Sender.USER ? 'user' : 'assistant',
      content: message.text,
    }));
    inputMessages.unshift({
      role: 'system',
      content: `Basado en estos mensajes del inicio de una conversación entre una persona y un chatbot, genera un breve título de máximo 8 palabras que represente el tema principal. 
      No uses comillas ni signos de puntuación innecesarios.
      Responde solo con el título sugerido.`,
    });

    const result = await generateText({
      model: this.openRouter('qwen/qwen3-30b-a3b-thinking-2507'),
      messages: inputMessages,
    });

    const title = result.text;

    const modelObject = await this.chatModelsService.findByModelId(model);

    const chat = new this.chatModel({
      _id: chatId,
      title,
      messages,
      model: modelObject,
      createdAt: Date.now(),
    });
    try {
      return await chat.save();
    } catch (error) {
      console.error('Error creating chat:', error);
      throw new Error('Failed to create chat');
    }
  }

  async getChat(chatId: string): Promise<Chat | null> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }
    return chat;
  }

  async updateChatMessages(
    chatId: string,
    newMessages: Message[],
  ): Promise<void> {
    const chat = await this.chatModel.findOne({ _id: chatId }).exec();
    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    chat.messages = chat.messages.concat(newMessages);

    try {
      await chat.save();
    } catch (error) {
      console.error('Error updating chat messages:', error);
      throw new Error('Failed to update chat messages');
    }
  }

  async getResponse(
    getResponseDto: GetResponseDto,
  ): Promise<
    { newChatId: string; newChatTitle: string; response: Message } | undefined
  > {
    const chatId = getResponseDto.chatId;
    const { message, model } = getResponseDto;

    let chat: Chat | null = null;
    let messages: ModelMessage[] = [];

    if (chatId) {
      chat = await this.chatModel.findById(chatId).exec();
      if (!chat) {
        throw new Error(`No se encontró el chat con ID ${chatId}`);
      }
    }

    if (chat) {
      messages = chat.messages.map((message) => ({
        role: message.sender === Sender.USER ? 'user' : 'assistant',
        content: message.text,
      }));
    } else {
      messages = [
        {
          role: 'user',
          content: message.text,
        },
      ];
    }

    const response = await generateText({
      model: this.openRouter(model),
      messages,
    });

    const timestamp = Date.now();
    const responseMessage: Message = {
      _id: `${timestamp}_ai`,
      sender: Sender.AI,
      text: response.text,
      timestamp,
    };

    if (!chat) {
      const messages = [message, responseMessage];
      const newId = new mongoose.Types.ObjectId().toString();
      const newChat = await this.createChat(newId, messages, model);

      return {
        newChatId: newChat._id,
        newChatTitle: newChat.title,
        response: responseMessage,
      };
    }

    await this.updateChatMessages(chatId!, [message, responseMessage]);

    return {
      newChatId: '',
      newChatTitle: '',
      response: responseMessage,
    };
  }
}
