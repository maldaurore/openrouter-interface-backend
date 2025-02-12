import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { TicketsService, Ticket } from './tickets.service';

@Controller('TicketsSoporte')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // Obtener tickets con filtros opcionales
  @Get()
  async getTickets(
    @Query('idCliente') idCliente?: string,
    @Query('estatus') estatus?: string,
    @Query('personaAsignada') personaAsignada?: string,
    @Query('tipoIncidencia') tipoIncidencia?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.ticketsService.getTickets({ idCliente, estatus, personaAsignada, tipoIncidencia, fechaInicio, fechaFin });
  }

  // Asignar ticket a una persona
  @Post('asignar/:id')
  async asignarTicket(@Param('id') id: number, @Body('responsable') responsable: string) {
    await this.ticketsService.asignarTicket(id, responsable);
    return { message: `Ticket ${id} asignado a ${responsable}` };
  }

  // Marcar ticket como solucionado
  @Post('solucionar/:id')
  async solucionarTicket(@Param('id') id: number, @Body('solucion') solucion: string) {
    await this.ticketsService.solucionarTicket(id, solucion);
    return { message: `Ticket ${id} marcado como solucionado` };
  }

  // Marcar ticket como "Sin Solución"
  @Post('sinSolucion/:id')
  async marcarSinSolucion(@Param('id') id: number, @Body('notasRechazo') notasRechazo: string) {
    await this.ticketsService.marcarSinSolucion(id, notasRechazo);
    return { message: `Ticket ${id} marcado como 'Sin Solución'` };
  }
}
