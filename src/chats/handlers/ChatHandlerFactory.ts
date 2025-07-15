import { Injectable } from "@nestjs/common";
import { ChatType } from "types";
import { IChatHander } from "./IChatHandler";
import { ModelChatHandler } from "./ModelChatHander";
import { AssistantChatHandler } from "./AssistantChatHandler";
import { braianChatHandler } from "./BraianChatHandler";

@Injectable()
export class ChatHandlerFactory {
  constructor(
    private modelHandler: ModelChatHandler,
    private assistantHandler: AssistantChatHandler,
    private braianHandler: braianChatHandler
  ) {}

  getHandler(type: ChatType): IChatHander {
    switch (type) {
      case 'model':
        return this.modelHandler;
      case "assistant":
        return this.assistantHandler;
      case "braian":
        return this.braianHandler;
      default:
        throw new Error("Tipo de chat desconocido.")
    }
  }
}