import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Message {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  timestamp: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);