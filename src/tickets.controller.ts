import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from './tickets.schema';

@Controller('TicketsSoporte')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async getTickets(
    @Query('idCliente') idCliente?: string,
    @Query('estatus') estatus?: string,
    @Query('personaAsignada') personaAsignada?: string,
    @Query('tipoIncidencia') tipoIncidencia?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ): Promise<Ticket[]> {
    return this.ticketsService.getTickets({ idCliente, estatus, personaAsignada, tipoIncidencia, fechaInicio, fechaFin });
  }

  @Post('asignar/:id')
  async asignarTicket(@Param('id') id: string, @Body('responsable') responsable: string) {
    return this.ticketsService.asignarTicket(id, responsable);
  }

  @Post('solucionar/:id')
  async solucionarTicket(@Param('id') id: string, @Body('solucion') solucion: string) {
    return this.ticketsService.solucionarTicket(id, solucion);
  }

  @Post('sinSolucion/:id')
  async marcarSinSolucion(@Param('id') id: string, @Body('notasRechazo') notasRechazo: string) {
    return this.ticketsService.marcarSinSolucion(id, notasRechazo);
  }
}
