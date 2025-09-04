import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message } from './message.schema';
import { Model, ModelSchema } from 'src/chat-models/schemas/model.schema';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop()
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  messages: Array<Message>;

  @Prop({ type: ModelSchema, required: true })
  model: Model;

  @Prop({ required: true })
  createdAt: number;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
