import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
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

  @Post('new-chat')
  @UseGuards(JwtAuthGuard)
  async createChat(
    @CurrentUserId() userId: string,
    @Body() { title, messages, model, threadId }
    ): Promise<{ chat: Chat }> {
    const chat = await this.chatsService.createChat(userId, title, messages, model, threadId);
    return { chat };
  }

  @Put('update-chat-messages')
  @UseGuards(JwtAuthGuard)
  async updateChatMessages(
    @CurrentUserId() userId: string,
    @Body() { chatId, messages }
  ): Promise<void> {
    await this.chatsService.updateChatMessages(chatId, userId, messages);
  }
}