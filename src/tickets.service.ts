import { Injectable } from '@nestjs/common';

export interface Ticket {
  id: number;
  fechaReporte: Date;
  clienteNombre: string;
  asunto: string;
  descripcion: string;
  tipoIncidencia: string;
  responsable?: string;
  estatus: string;
  solucion?: string;
  fechaSolucion?: Date;
  fechaRechazo?: Date;
  notasRechazo?: string;
  notasInternas?: string;
}

@Injectable()
export class TicketsService {
  private tickets: Ticket[] = [
    {
      id: 1,
      fechaReporte: new Date(),
      clienteNombre: 'Cliente A',
      asunto: 'Problema con la red',
      descripcion: 'No hay conexión a internet',
      tipoIncidencia: 'Red',
      estatus: 'Pendiente',
    },
    {
      id: 2,
      fechaReporte: new Date(),
      clienteNombre: 'Cliente B',
      asunto: 'Falla en impresora',
      descripcion: 'No imprime correctamente',
      tipoIncidencia: 'Hardware',
      estatus: 'Pendiente',
    },
  ];

  async getTickets(filters: any): Promise<Ticket[]> {
    return this.tickets.filter((ticket) => {
      return (
        (!filters.idCliente || ticket.clienteNombre === filters.idCliente) &&
        (!filters.estatus || ticket.estatus === filters.estatus) &&
        (!filters.personaAsignada || ticket.responsable === filters.personaAsignada) &&
        (!filters.tipoIncidencia || ticket.tipoIncidencia === filters.tipoIncidencia) &&
        (!filters.fechaInicio || !filters.fechaFin || 
          (ticket.fechaReporte >= new Date(filters.fechaInicio) && ticket.fechaReporte <= new Date(filters.fechaFin)))
      );
    });
  }

  async asignarTicket(id: number, responsable: string): Promise<void> {
    const ticket = this.tickets.find((t) => t.id === id);
    if (ticket) {
      ticket.responsable = responsable;
      ticket.estatus = 'Asignado';
    }
  }

  async solucionarTicket(id: number, solucion: string): Promise<void> {
    const ticket = this.tickets.find((t) => t.id === id);
    if (ticket) {
      ticket.solucion = solucion;
      ticket.estatus = 'Solucionado';
      ticket.fechaSolucion = new Date();
    }
  }

  async marcarSinSolucion(id: number, notasRechazo: string): Promise<void> {
    const ticket = this.tickets.find((t) => t.id === id);
    if (ticket) {
      ticket.estatus = 'Sin Solución';
      ticket.fechaRechazo = new Date();
      ticket.notasRechazo = notasRechazo;
    }
  }
}
