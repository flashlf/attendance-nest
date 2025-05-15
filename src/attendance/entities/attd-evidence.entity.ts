import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
}

import { AttendanceEntity } from './attendance.entity';

@Entity('attd_evidence')
export class AttdEvidenceEntity {
    @PrimaryColumn('text')
    id: string;
  
    @Column({ name: 'attd_id', type: 'text', nullable: true })
    attdId: string;
  
    @ManyToOne(() => AttendanceEntity, (a) => a.evidence)
    @JoinColumn({ name: 'attd_id' })
    attendance: AttendanceEntity;
  
    @Column({ name: 'file_location', type: 'text', nullable: true })
    fileLocation: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @Column({ name: 'created_by', type: 'text', nullable: true })
    createdBy: string;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @Column({ name: 'updated_by', type: 'text', nullable: true })
    updatedBy: string;
}
