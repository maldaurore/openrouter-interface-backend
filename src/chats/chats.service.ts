import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Chat, ChatDocument } from "./chats.schema";
import { Model } from "mongoose";
import { Message } from "./message.schema";


@Injectable()
export class ChatsService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async getUserChats(userId: string): Promise<Chat[]> {
    return this.chatModel
      .find({ user: userId })
      .select('_id title createdAt')
      .sort({ createdAt: -1 })
      .exec();
  }

  async createChat(userId: string, title: string, messages: Message[], model: string): Promise<Chat> {
    const chat = new this.chatModel({
      title,
      messages,
      user: userId,
      model,
      createdAt: Date.now()
    });
    try {
      return await chat.save();
    } catch (error) {
      console.error("Error creating chat:", error);
      throw new Error("Failed to create chat");
    }
    
  }

  async getChat(chatId: string, userId: string): Promise<Chat | null> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }
    if (chat.user !== userId) {
      throw new Error(`Chat with ID ${chatId} does not belong to user ${userId}`);
    }
    return chat;
  }
}