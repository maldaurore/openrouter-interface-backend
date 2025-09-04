import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { MessageDto } from './message.dto';
import { Transform, Type } from 'class-transformer';

export class GetResponseDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === null ? undefined : (value as string)))
  chatId?: string;

  @ValidateNested()
  @Type(() => MessageDto)
  message: MessageDto;

  @IsString()
  model: string;
}
