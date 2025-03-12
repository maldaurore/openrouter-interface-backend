import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Responsable, ResponsableSchema } from './responsable.schema';

export type TicketDocument = Ticket & Document;

@Schema({ collection: 'tickets' })
export class Ticket {

  @Prop({ required: true })
  fechaReporte: Date;

  @Prop({ required: true })
  clienteNombre: string;

  @Prop({ required: true })
  asunto: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  tipoIncidencia: string;

  @Prop({ type: { _id: String, nombre: String } })
  responsable?: Responsable;

  @Prop({ default: 'sin-asignar' })
  estatus: string;

  @Prop()
  solucion?: string;

  @Prop()
  fechaSolucion?: Date;

  @Prop()
  fechaRechazo?: Date;

  @Prop()
  notasRechazo?: string;

  @Prop()
  notasInternas?: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);