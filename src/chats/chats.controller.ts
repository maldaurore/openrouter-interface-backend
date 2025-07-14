import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { Chat } from "./chats.schema";
import { JwtAuthGuard } from "src/JwtAuthGuard";
import { CurrentUserId } from "src/decorators/current-user-id.decorator";

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('user-chats')
  @UseGuards(JwtAuthGuard)
  async getUserChats(@CurrentUserId() userId: string): Promise<( {chats: Chat[]} )> {
    const chats = await this.chatsService.getUserChats(userId);
    return { chats };
  }

  @Get(':chatId')
  @UseGuards(JwtAuthGuard)
  async getChat(
    @CurrentUserId() userId: string,
    @Req() req: any
  ): Promise<{ chat: Chat | null }> {
    const chatId = req.params.chatId;
    const chat = await this.chatsService.getChat(chatId, userId);
    return { chat };
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-response')
  async getResponse(
    @Body() { chatId, chatType, message, model },
    @CurrentUserId() userId: string,
    ) {
    return this.chatsService.getResponse(chatId, chatType, message, model, userId);
  }

}