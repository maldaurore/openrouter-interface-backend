import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Chat, ChatDocument } from "./chats.schema";
import mongoose, { Model } from "mongoose";
import { Message } from "./message.schema";
import OpenAI from "openai";
import { ChatType, Sender } from "types";
import { ChatHandlerFactory } from "./handlers/ChatHandlerFactory";
import { generateId } from "./utils/chats.utils";

@Injectable()
export class ChatsService {

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @Inject('OPENAI_INSTANCE') private openai: OpenAI,
    private readonly chatHandlerFactory: ChatHandlerFactory,
    ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return this.chatModel
      .find({ user: userId })
      .select('_id title createdAt')
      .sort({ createdAt: -1 })
      .exec();
  }

  async createChat(
    chatId: string,
    userId: string, 
    messages: Message[], 
    model: string, 
  ): Promise<Chat> {
    const input = messages
      .map((m) => `${m.sender === Sender.USER ? 'Usuario' : 'IA'}: ${m.text}`)
      .join('\n');

    const request = await this.openai.responses.create({
      model: "gpt-4o-mini",
      input,
      instructions: `Basado en estos mensajes del inicio de una conversación entre una persona y un chatbot, genera un breve título de máximo 8 palabras que represente el tema principal. 
      No uses comillas ni signos de puntuación innecesarios.
      Responde solo con el título sugerido.`
    });

    const title = request.output_text;
  
    const chat = new this.chatModel({
      _id: chatId,
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

  async updateChatMessages(chatId: string, userId: string, newMessages: Message[]): Promise<void> {
    const chat = await this.chatModel.findOne({_id: chatId, user:userId}).exec()
    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    chat.messages = chat.messages.concat(newMessages);

    try {
      await chat.save()
    } catch (error) {
      console.error("Error updating chat messages:", error);
      throw new Error("Failed to update chat messages");
    }
  }

  async getResponse(
    chatId: string, 
    chatType: ChatType, 
    message: Message, 
    model: string, 
    userId: string
  ): Promise<{newChatId: string, newChatTitle: string, response: Message} | undefined> {
    
    const handler = this.chatHandlerFactory.getHandler(chatType);

    let chat: Chat | null = null;

    if (chatId) {
      chat = await this.chatModel.findById(chatId).exec();
      if (!chat) {
        throw new Error (`No se encontró el chat con ID ${chatId}`);
      }
    }

    const responseObj = await handler.getResponse(chatId, message, model);
    const response = responseObj.response;
    chatId = responseObj.chatId;

    if (!chat) {
      const messages = [message, response];
      const newId = generateId(chatType, chatId);
      const newChat = await this.createChat(newId, userId, messages, model)

      return {
        newChatId: newChat._id,
        newChatTitle: newChat.title,
        response,
      }
    }

    await this.updateChatMessages(chatId, userId, [message, response]);

    return {
      newChatId: '',
      newChatTitle: '',
      response,
    }

  }
}
