import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Message } from "./message.schema";

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  messages: Array<Message>;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  model: string;

  @Prop()
  threadId: string;

  @Prop({ required: true })
  createdAt: number;
  
}

export const ChatSchema = SchemaFactory.createForClass(Chat);