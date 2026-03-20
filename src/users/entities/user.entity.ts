import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'idUsuario' })
  idUsuario: number;

  @Column({ length: 100 })
  nombre: string;

  @CreateDateColumn({ name: 'fechaCreacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fechaActualizacion' })
  fechaActualizacion: Date;
}
