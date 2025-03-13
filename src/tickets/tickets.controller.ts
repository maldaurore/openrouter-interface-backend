import { Controller, Get, Post, Body, Query, Param, UseGuards, Put } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from './tickets.schema';
import { JwtAuthGuard } from '../JwtAuthGuard';
import { Responsable } from './responsable.schema';

@Controller('TicketsSoporte')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTickets(
    @Query('id') id?: string,
    @Query('nombreCliente') nombreCliente?: string,
    @Query('estatus') estatus?: string,
    @Query('responsable') responsable?: string,
    @Query('tipoIncidencia') tipoIncidencia?: string,
    @Query('fechaReporte') fechaReporte?: string,
  ): Promise<Ticket[]> {
    return this.ticketsService.getTickets({ id, nombreCliente, estatus, responsable, tipoIncidencia, fechaReporte });
  }

  @Put('asignar/:id')
  async asignarTicket(@Param('id') id: string, @Body('responsable') responsable: Responsable) {
    return this.ticketsService.asignarTicket(id, responsable);
  }

  @Put('solucionar/:id')
  async solucionarTicket(@Param('id') id: string, @Body('solucion') solucion: string) {
    return this.ticketsService.solucionarTicket(id, solucion);
  }

  @Put('sinSolucion/:id')
  async marcarSinSolucion(@Param('id') id: string, @Body('notasRechazo') notasRechazo: string) {
    return this.ticketsService.marcarSinSolucion(id, notasRechazo);
  }

  @Put('agregarNota/:id')
  async agregarNote(@Param('id') id: string, @Body('nota') nota: string) {
    return this.ticketsService.agregarNota(id, nota);
  }
}
