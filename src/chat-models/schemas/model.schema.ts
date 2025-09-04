import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModelDocument = Model & Document;

@Schema()
export class Model {
  @Prop({ required: true })
  modelId: string;

  @Prop({ required: true })
  name: string;
}

export const ModelSchema = SchemaFactory.createForClass(Model);
