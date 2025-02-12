import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fechaReporte: Date;

  @Column()
  clienteNombre: string;

  @Column()
  asunto: string;

  @Column('text')
  descripcion: string;

  @Column()
  tipoIncidencia: string;

  @Column()
  responsable: string;

  @Column()
  estatus: string;

  @Column({ nullable: true })
  solucion: string;

  @Column({ nullable: true })
  fechaSolucion: Date;

  @Column({ nullable: true })
  fechaRechazo: Date;

  @Column({ nullable: true })
  notasRechazo: string;

  @Column({ nullable: true })
  notasInternas: string;
}