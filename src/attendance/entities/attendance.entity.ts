import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AttdTypeEntity } from './attd-type.entity';
import { AttendanceDetailEntity } from './attendance-detail.entity';
import { AttdEvidenceEntity } from './attd-evidence.entity';
import { AttdConfirmationRequestEntity } from './attd-confirmation-request.entity';

export enum FlagLocation {
  WFH = 'wfh',
  WFO = 'wfo',
  LEAVE = 'leave',
}

@Entity('attendance')
export class AttendanceEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ name: 'type_id', type: 'text', nullable: true })
  typeId: string;

  @JoinColumn({ name: 'type_id' })
  type: AttdTypeEntity;

  @Column({ name: 'leave_type_id', type: 'text', nullable: true })
  leaveTypeId: string;

  @Column({ name: 'emp_id', type: 'text', nullable: true })
  empId: string;

  @Column({ type: 'date', nullable: true })
  date: string;

  @Column({ name: 'shift_id', type: 'text' })
  shiftId: string;

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

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AttendanceDetailEntity, (d) => d.attendance)
  details: AttendanceDetailEntity[];

  @OneToMany(() => AttdEvidenceEntity, (e) => e.attendance)
  evidence: AttdEvidenceEntity[];

  @OneToMany(() => AttdConfirmationRequestEntity, (r) => r.attendance)
  confirmationRequests: AttdConfirmationRequestEntity[];
}
