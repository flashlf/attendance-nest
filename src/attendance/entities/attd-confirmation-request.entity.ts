// src/attendance/entities/attd-confirmation-request.entity.ts
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

@Entity('attd_confirmation_requests')
export class AttdConfirmationRequestEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ name: 'attendance_id', type: 'text', nullable: true })
  attendanceId: string;

  @ManyToOne(() => AttendanceEntity, (a) => a.id)
  @JoinColumn({ name: 'attendance_id' })
  attendance: AttendanceEntity;

  @Column({ name: 'emp_id', type: 'text', nullable: true })
  empId: string;

  @Column({ type: 'date', nullable: true })
  date: string;

  @Column({ type: 'text', nullable: true })
  type: string;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  source: string;

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
