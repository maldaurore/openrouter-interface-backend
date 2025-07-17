import OpenAI from "openai";
import { IChatHander } from "./IChatHandler";
import { Message } from "../schemas/message.schema";
import { EasyInputMessage } from "openai/resources/responses/responses";
import { Sender } from "types";
import { InjectModel } from "@nestjs/mongoose";
import { Chat, ChatDocument } from "../schemas/chats.schema";
import { Model } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ModelChatHandler implements IChatHander {
  constructor(
    @Inject('OPENAI_INSTANCE') private openai: OpenAI,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>
    ) {}

  async getResponse(chatId: string, message: Message, model: string) : Promise<{chatId: string, response: Message}> {
    const history = chatId ? await this.buildHistory(chatId) : [];
    history.push({role: 'user', content: message.text, type: 'message'});

    const request = await this.openai.responses.create({ model, input: history });

    return {
      chatId: chatId,
      response: {
        _id: Date.now().toString() + "_ai",
        text: request.output_text,
        sender: Sender.AI,
        timestamp: Date.now()
      }
    }
  }

  private async buildHistory(chatId: string): Promise<EasyInputMessage[]> {
    const chat = await this.chatModel.findById(chatId).exec();

    if (!chat) {
      throw new Error("Documento de chat no encontrado.");
    }

    const history: EasyInputMessage[] = chat.messages.map((msg) => ({
      role: msg.sender === Sender.USER ? 'user' : 'assistant',
      content: msg.text as string,
      type: 'message'
    }));

    return history;
  }
}