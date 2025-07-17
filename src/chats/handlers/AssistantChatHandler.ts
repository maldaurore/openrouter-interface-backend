import OpenAI from "openai";
import { IChatHander } from "./IChatHandler";
import { Message } from "../schemas/message.schema";
import { Sender } from "types";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AssistantChatHandler implements IChatHander {
  constructor(@Inject('OPENAI_INSTANCE') private openai: OpenAI) {}

  async getResponse(chatId: string, message: Message, model: string): Promise<{chatId: string, response: Message}> {
    if (!chatId) {
      const thread = await this.openai.beta.threads.create();
      chatId = thread.id;
    }

    await this.openai.beta.threads.messages.create(chatId, { role: 'user', content: message.text });

    const run = await this.openai.beta.threads.runs.create(chatId, { assistant_id: model });

    let runResult = run;
    while (runResult.status !== "completed" && runResult.status !== "failed") {
      await new Promise((res) => setTimeout(res, 1000));
      runResult = await this.openai.beta.threads.runs.retrieve(run.id, {thread_id: chatId});
    }

    const messages = await this.openai.beta.threads.messages.list(chatId);
    const lastMessage = messages.data.find(m => m.role === 'assistant');
    const block = lastMessage?.content?.[0];

    if (block && 'text' in block && typeof block.text?.value === 'string') {
      return {
        chatId: chatId,
        response: {
          _id: Date.now().toString() + "_ai",
          text: block.text.value,
          sender: Sender.AI,
          timestamp: Date.now()
        }
      }
    }

    throw new Error("No se pudo obtener la respuesta del asistente");
    
  }
}