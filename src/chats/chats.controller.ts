import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { Chat } from "./schemas/chats.schema";
import { JwtAuthGuard } from "src/JwtAuthGuard";
import { CurrentUserId } from "src/decorators/current-user-id.decorator";
import { GetResponseDto } from "./dto/get-response.dto";

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
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getResponse(
    @Body() getResponseDto: GetResponseDto,
    @CurrentUserId() userId: string,
    ) {
    return this.chatsService.getResponse(getResponseDto, userId);
  }

}