import { Message } from "../schemas/message.schema";

export interface IChatHander {
  getResponse(chatId: string | undefined, message: Message, model: string): Promise<{chatId: string, response: Message}>;
}