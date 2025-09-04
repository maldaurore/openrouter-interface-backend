import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat } from './schemas/chats.schema';
import { GetResponseDto } from './dto/get-response.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('user-chats')
  async getUserChats(): Promise<{ chats: Chat[] }> {
    const chats = await this.chatsService.getAllChats();
    return { chats };
  }

  @Get(':chatId')
  async getChat(@Req() req: any): Promise<{ chat: Chat | null }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const chatId = req.params.chatId as string;
    const chat = await this.chatsService.getChat(chatId);
    return { chat };
  }

  @Post('get-response')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getResponse(@Body() getResponseDto: GetResponseDto) {
    return this.chatsService.getResponse(getResponseDto);
  }
}
