import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ModelsService } from './chat-models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { JwtAuthGuard } from 'src/JwtAuthGuard';
import { CurrentUserId } from 'src/decorators/current-user-id.decorator';

@Controller('chat-models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createModelDto: CreateModelDto) {
    return this.modelsService.create(createModelDto);
  }

  @Get()
  findAll() {
    return this.modelsService.findAll();
  }

  @Get('user-models')
  @UseGuards(JwtAuthGuard)
  findUserModels(@CurrentUserId() userId: string) {
    return this.modelsService.findUserModels(userId)
  }

  
}