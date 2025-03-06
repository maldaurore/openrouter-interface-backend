import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop()
  responsable?: string;

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