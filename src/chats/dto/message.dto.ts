import { IsEnum, IsNumber, IsString } from "class-validator";
import { Sender } from "types";

export class MessageDto {
  @IsString()
  _id: string;

  @IsString()
  text: string;

  @IsEnum(Sender)
  sender: Sender;

  @IsNumber()
  timestamp: number;
}