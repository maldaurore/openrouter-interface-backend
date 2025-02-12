import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './tickets.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async getTickets(filters: any): Promise<Ticket[]> {
    const query = this.ticketRepository.createQueryBuilder('ticket');

    if (filters.idCliente) query.andWhere('ticket.clienteNombre = :idCliente', { idCliente: filters.idCliente });
    if (filters.estatus) query.andWhere('ticket.estatus = :estatus', { estatus: filters.estatus });
    if (filters.personaAsignada) query.andWhere('ticket.responsable = :personaAsignada', { personaAsignada: filters.personaAsignada });
    if (filters.tipoIncidencia) query.andWhere('ticket.tipoIncidencia = :tipoIncidencia', { tipoIncidencia: filters.tipoIncidencia });
    if (filters.fechaInicio && filters.fechaFin) {
      query.andWhere('ticket.fechaReporte BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio: filters.fechaInicio,
        fechaFin: filters.fechaFin,
      });
    }

    return query.getMany();
  }

  async asignarTicket(id: number, responsable: string): Promise<void> {
    await this.ticketRepository.update(id, { responsable, estatus: 'Asignado' });
  }

  async solucionarTicket(id: number, solucion: string): Promise<void> {
    await this.ticketRepository.update(id, { solucion, estatus: 'Solucionado', fechaSolucion: new Date() });
  }

  async marcarSinSolucion(id: number, notasRechazo: string): Promise<void> {
    await this.ticketRepository.update(id, { estatus: 'Sin Solución', fechaRechazo: new Date(), notasRechazo });
  }
}