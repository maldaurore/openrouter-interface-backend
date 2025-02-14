import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from './tickets.schema';

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>) {}

  async getTickets(filters: any): Promise<Ticket[]> {
    return this.ticketModel.find(filters).exec();
  }

  async asignarTicket(id: string, responsable: string): Promise<Ticket | null> {
    return this.ticketModel.findByIdAndUpdate(id, { responsable, estatus: 'Asignado' }, { new: true }).exec();
  }

  async solucionarTicket(id: string, solucion: string): Promise<Ticket | null> {
    return this.ticketModel.findByIdAndUpdate(id, { solucion, estatus: 'Solucionado', fechaSolucion: new Date() }, { new: true }).exec();
  }

  async marcarSinSolucion(id: string, notasRechazo: string): Promise<Ticket | null> {
    return this.ticketModel.findByIdAndUpdate(id, { estatus: 'Sin Solución', fechaRechazo: new Date(), notasRechazo }, { new: true }).exec();
  }
}
