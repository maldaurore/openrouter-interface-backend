import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Chat, ChatDocument } from "./chats.schema";
import mongoose, { Model } from "mongoose";
import { Message } from "./message.schema";
import OpenAI from "openai";
import { ChatType, Sender } from "types";
import { EasyInputMessage, ResponseInput } from "openai/resources/responses/responses";


@Injectable()
export class ChatsService {
  private openai: OpenAI;
  private braianBaseUrl: string | undefined;
  private braianApiKey: string | undefined;

  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.braianBaseUrl = process.env.BRAIAN_BASE_URL;
    this.braianApiKey = process.env.BRAIAN_ACCESS_TOKEN
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

  async getResponse(chatId: string, chatType: ChatType, message: Message, model: string, userId: string): Promise<{newChatId: string, newChatTitle: string, response: Message} | undefined> {
    
    let chat: Chat | null;
    let newChatId: string = '';
    let newChatTitle: string = '';
    let response: Message;

    if (chatId) {
      chat = await this.chatModel.findById(chatId).exec();
      if (!chat) {
        throw new Error(`Chat with ID ${chatId} not found`);
      }
    } else chat = null;

    if (chatType == 'model') {

      let history: EasyInputMessage[] = []

      if (chat) {
        history = chat.messages.map((msg) => ({
          role: msg.sender === Sender.USER ? 'user' : 'assistant',
          content: msg.text as string,
          type: 'message'
        }));
      }
      
      history = history.concat([{
        role: 'user',
        content: message.text,
        type: 'message'
      }]);
  
      const input: ResponseInput = history
  
      const request = await this.openai.responses.create({
        model,
        input,
      });

      response = {
        _id: Date.now().toString() + '_ai',
        text: request.output_text,
        sender: Sender.AI,
        timestamp: Date.now()
      }
  
    } else if (chatType === 'assistant') {
    
      if (!chatId) {
        const thread = await this.openai.beta.threads.create();
        chatId = thread.id;
      }
  
      await this.openai.beta.threads.messages.create(chatId, {
        role: 'user',
        content: message.text,
      });
  
      const run = await this.openai.beta.threads.runs.create(chatId, {
        assistant_id: model,
      });
  
      let status = run.status;
      let runResult = run;
  
      while (status !== "completed" && status !== "failed") {
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        runResult = await this.openai.beta.threads.runs.retrieve(run.id, {
          thread_id: chatId,
        });
        status = runResult.status;
      }
  
      const messages = await this.openai.beta.threads.messages.list(chatId);
      const lastMessage = messages.data.find(m => m.role === 'assistant');
  
      const block = lastMessage?.content?.[0];
  
      if (block && 'text' in block && typeof block.text?.value === 'string') {
        response = {
          _id: Date.now().toString() + '_ai',
          text: block.text.value,
          sender: Sender.AI,
          timestamp: Date.now()
        }

      } else {
        throw new Error("No se pudo obtener la respuesta del asistente.");
      } 
      
    } else if (chatType === 'braian') {

      const braianAssistantId = model;

      if (!this.braianBaseUrl || !this.braianApiKey) {
        throw new Error("BRAIAN_BASE_URL o BRAIAN_ACCESS_TOKEN no están definidos");
      }
  
      if (!chatId) {
        const sessionRes = await fetch(`${this.braianBaseUrl}/${braianAssistantId}/sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.braianApiKey as string,
          },
        });
        
        if (!sessionRes.ok) {
          throw new Error ("No se pudo crear la sesion de Braian");
        }

        const braianSession = await sessionRes.json() as { sessionId: string };
        console.log(braianSession)
        chatId = braianSession.sessionId;
      }
  
      const request = await fetch(`${this.braianBaseUrl}/${braianAssistantId}/sessions/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.braianApiKey as string,
        },
        body: JSON.stringify({
          message: {
            text: message.text,
          },
          stream: false
        }),
      })
      
      if (!request.ok || !request.body) {
        throw new Error("No se pudo obtener la respuesta." + request.statusText)
      }
  
      const braianResponse = await request.json()

      response = {
        _id: Date.now().toString() + '_ai',
        text: braianResponse.response,
        sender: Sender.AI,
        timestamp: Date.now()
      };

    } else {
      throw new Error("Unknown chat type.")
    }

    if (!chat) {
      
      try {
        const messages = [message, response]
        const id = generateId(chatType, chatId)
        const newChat = await this.createChat(id, userId, messages, model)
        newChatId = newChat._id;
        newChatTitle = newChat.title;
      } catch (e) {
        throw new Error("Error al guardar el chat: " + e)
      }
      
    } else {
      try {
        await this.updateChatMessages(chatId, userId, [message, response]);
      } catch (e) {
        throw new Error("Error al actualizar el chat: " + e);
      }
      
    }

    return {newChatId, newChatTitle, response}

  }
}

function generateId(type: ChatType, externalId?: string): string {
  switch (type) {
    case 'braian':
    case 'assistant':
      if (!externalId) throw new Error('external ID required');
      return externalId;
    case 'model':
    default:
      return new mongoose.Types.ObjectId().toString();
  }
}