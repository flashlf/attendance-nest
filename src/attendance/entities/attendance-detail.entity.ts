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
  IN = 'in',
  OUT = 'out',
}

@Entity('attd_details')
export class AttendanceDetailEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ name: 'attendance_id', type: 'text', nullable: true })
  attdId: string;

  @ManyToOne(() => AttendanceEntity, (a) => a.id)
  @JoinColumn({ name: 'attendance_id' })
  attendance: AttendanceEntity;

  @Column({ type: 'enum', enum: InOut, nullable: true, enumName: 'inout_type' })
  inout: InOut;

  @Column({ type: 'time', nullable: true })
  time: string;

  @Column({ name: 'latitude', type: 'text', nullable: false })
  latitude: string;

  @Column({ name: 'longitude', type: 'text', nullable: false })
  longitude: string;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'text', nullable: true })
  source: string;

  @Column({ name: 'source_reference', type: 'text', nullable: true })
  sourceReference: string;

  @Column({
    name: 'flag_location',
    type: 'enum',
    enum: FlagLocation,
    nullable: true,
    enumName: 'flag_location',
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
