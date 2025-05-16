import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceEntity } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { CheckInDto } from './dto/check-in.dto';
import * as moment from 'moment-timezone';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceEntity)
    private readonly attdModel: Repository<any>,
  ) {}

  async findByEmpIdAndDate(
    empId: string,
    date: string,
  ): Promise<AttendanceEntity | null> {
    return this.attdModel.findOne({ where: { empId, date } });
  }

  async validateAttendance(empId: string, date: string): Promise<void> {
    const existing = await this.findByEmpIdAndDate(empId, date);
    if (existing) {
      throw new HttpException(
        { status: false, message: 'Already Checked In', data: existing },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async checkIn(empId: string, dto: CheckInDto): Promise<AttendanceEntity> {
    const now = moment().tz(dto.timezone);
    const today = now.format('YYYY-MM-DD');
    const timeStr = now.format('HH:mm:ss');

    
  }
}
