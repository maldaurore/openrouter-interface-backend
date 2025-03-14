import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from './tickets.schema';
import { Responsable } from './responsable.schema';

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>) {}

  async getTickets(filters: any): Promise<{ tickets: Ticket[], total: number }> {

    let mongoFilters: any = {};

    if (filters.nombreCliente) mongoFilters.clienteNombre = filters.nombreCliente;
    if (filters.estatus) mongoFilters.estatus = filters.estatus;
    if (filters.responsable) mongoFilters["responsable._id"] = filters.responsable;
    if (filters.tipoIncidencia) mongoFilters.tipoIncidencia = filters.tipoIncidencia;
    if (filters.fechaReporte) mongoFilters.fechaReporte = new Date(filters.fechaReporte);

    if (filters.id) mongoFilters = { _id: filters.id };

    const total = await this.ticketModel.countDocuments(mongoFilters).exec();
    const tickets = await this.ticketModel
    .find(mongoFilters)
    .skip((filters.page - 1) * filters.limit)
    .limit(filters.limit)
    .exec();

    return { tickets, total }
  }

  async asignarTicket(id: string, responsable: Responsable): Promise<Ticket | null> {
    return this.ticketModel.findByIdAndUpdate(id, { responsable, estatus: 'asignado' }, { new: true }).exec();
  }

  async solucionarTicket(id: string, solucion: string): Promise<Ticket | null> {
    return this.ticketModel.findByIdAndUpdate(id, { solucion, estatus: 'resuelto', fechaSolucion: new Date() }, { new: true }).exec();
  }

  async marcarSinSolucion(id: string, notasRechazo: string): Promise<Ticket | null> {
    return this.ticketModel.findByIdAndUpdate(id, { estatus: 'rechazado', fechaRechazo: new Date(), notasRechazo }, { new: true }).exec();
  }

  async agregarNota(id: string, nota: string): Promise<Ticket | null> {
    return this.ticketModel.findByIdAndUpdate(id, { $push: { notasInternas: nota } }, { new: true }).exec();
  }
}
