import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AttendanceEntity, FlagLocation } from './attendance.entity';

export enum InOut {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('attendance_details')
export class AttendanceDetailEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ name: 'attd_id', type: 'text', nullable: true })
  attdId: string;

  @ManyToOne(() => AttendanceEntity, (a) => a.id)
  @JoinColumn({ name: 'attd_id' })
  attendance: AttendanceEntity;

  @Column({ type: 'enum', enum: InOut, nullable: true })
  inout: InOut;

  @Column({ type: 'time', nullable: true })
  time: string;

  @Column({ type: 'text', nullable: true })
  source: string;

  @Column({ name: 'source_reference', type: 'text', nullable: true })
  sourceReference: string;

  @Column({
    name: 'flag_location',
    type: 'enum',
    enum: FlagLocation,
    nullable: true,
  })
  flagLocation: FlagLocation;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by', type: 'text', nullable: true })
  createdBy: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', type: 'text', nullable: true })
  updatedBy: string;
}
