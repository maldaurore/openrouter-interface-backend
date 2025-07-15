import { Sender } from "types";
import { Message } from "../message.schema";
import { IChatHander } from "./IChatHandler";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class braianChatHandler implements IChatHander {
  private baseUrl: string;
  private apiKey: string;

  constructor(private config: ConfigService) {
    this.baseUrl = this.config.get<string>('BRAIAN_BASE_URL')!;
    this.apiKey = this.config.get<string>('BRAIAN_ACCESS_TOKEN')!;
  }

  async getResponse(chatId: string, message: Message, model: string): Promise<{chatId: string, response: Message}> {
    if (!chatId) {
      const sessionRes = await fetch(`${this.baseUrl}/${model}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        }, 
      });

      const session = await sessionRes.json()
      chatId = session.sessionId;
    }

    const res = await fetch(`${this.baseUrl}/${model}/sessions/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey
      },
      body: JSON.stringify({ message: { text: message.text }, stream: false }),
    });

    const json = await res.json();

    return {
      chatId: chatId,
      response: {
        _id: Date.now().toString() + "_ai",
        text: json.response,
        sender: Sender.AI,
        timestamp: Date.now()
      }
    }
  }
}