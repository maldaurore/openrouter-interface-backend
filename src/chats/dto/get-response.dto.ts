import { IsIn, IsOptional, IsString, ValidateNested } from "class-validator";
import { MessageDto } from "./message.dto";
import { Transform, Type } from "class-transformer";

export class GetResponseDto {

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === null ? undefined : value)
  chatId?: string;

  @IsIn(['assistant', 'model', 'braian'])
  chatType: 'assistant' | 'model' | 'braian';

  @ValidateNested()
  @Type(() => MessageDto)
  message: MessageDto;

  @IsString()
  model: string;

}