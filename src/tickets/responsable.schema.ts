import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Responsable {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  nombre: string;
}

export const ResponsableSchema = SchemaFactory.createForClass(Responsable);