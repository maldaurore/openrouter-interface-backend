import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Sender } from "types";

@Schema()
export class Message {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  sender: Sender;

  @Prop({ required: true })
  timestamp: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);