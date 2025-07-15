import { Message } from "../message.schema";

export interface IChatHander {
  getResponse(chatId: string, message: Message, model: string): Promise<{chatId: string, response: Message}>;
}