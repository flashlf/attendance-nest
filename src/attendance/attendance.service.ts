import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceEntity } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { CheckInDto } from './dto/check-in.dto';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment-timezone';
import { AttendanceDetailEntity } from './entities/attendance-detail.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceEntity)
    private readonly attdModel: Repository<any>,
    @InjectRepository(AttendanceDetailEntity)
    private readonly detailsModel: Repository<any>,
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

    await this.validateAttendance(empId, today);

    const attd = await this.attdModel.create({
      id: uuidv4(),
      empId,
      date: today,
      startTime: timeStr,
      description: dto.description,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });

    return this.attdModel.save(attd);
  }

  async checkOut(empId: string, dto: CheckInDto) {
    const now = moment().tz(dto.timezone);
    const today = now.format('YYYY-MM-DD');
    const timeStr = now.format('HH:mm:ss');

    const attendance = await this.attdModel.findOne({
      where: { empId, date: today },
    });

    if (!attendance) {
      throw new HttpException(
        { status: false, message: "You haven't Checked In", data: null },
        HttpStatus.BAD_REQUEST,
      );
    }

    const outDetails = await this.detailsModel.count({
      where: { attdId: attendance.id, inout: 'OUT' },
    });

    if (outDetails > 3) {
      throw new HttpException(
        { status: false, message: 'Already checked out 3 times', data: null },
        HttpStatus.FORBIDDEN,
      );
    }

    const detail = this.detailsModel.create({
      id: uuidv4(),
      attdId: attendance.id,
      inout: 'OUT',
      time: timeStr,
      source: 'mobile', // ?? source ntar darimana ya?
      sourceReference: null,
      flagLocation: null,
      createdAt: new Date(),
      createdBy: empId,
    });

    await this.detailsModel.save(detail);

    return {
      attendance,
      detail,
    };
  }
}
