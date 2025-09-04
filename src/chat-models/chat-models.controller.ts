import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ModelsService } from './chat-models.service';
import { CreateModelDto } from './dto/create-model.dto';

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
  findUserModels() {
    return this.modelsService.findAllModels();
  }
}
