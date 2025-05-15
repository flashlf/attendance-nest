import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceEntity } from './entities/attendance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceEntity)
    private readonly attdModel: Repository<any>,
  ) { }

  async findByEmpIdAndDate(
    empId: string,
    date: string,
  ): Promise<AttendanceEntity | null> {
    return this.attdModel.findOne({ where: { empId, date } });
  }
}
