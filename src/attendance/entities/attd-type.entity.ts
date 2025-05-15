import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AttendanceEntity } from './attendance.entity';

@Entity('attd_types')
export class AttdTypeEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by', type: 'text', nullable: true })
  createdBy: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', type: 'text', nullable: true })
  updatedBy: string;

  @OneToMany(() => AttendanceEntity, (a) => a.type)
  attendances: AttendanceEntity[];
}
