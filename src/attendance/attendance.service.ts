import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceEntity } from './entities/attendance.entity';
import { Like, Repository } from 'typeorm';
import { CheckInDto } from './dto/check-in.dto';
import { AttendanceQueryDto } from './dto/attendance-quey.dto';
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

  async findAllAttendance(params: AttendanceQueryDto & { empId: string }) {
    const { q, order_by, direction, page, limit, empId } = params;

    const where: any = { empId };
    if (q) {
      where.remarksIn = Like(`%${q}%`);
    }

    const orderField = order_by ?? 'date';
    const sortDirection = (direction ?? 'asc').toUpperCase() as 'ASC' | 'DESC';

    const [data, total] = await this.attdModel.findAndCount({
      where,
      order: { [orderField]: sortDirection },
      skip: ((page ?? 1) - 1) * (limit ?? 10),
      take: limit,
    });

    return {
      status: true,
      message: 'Success',
      data: {
        items: data,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / (limit ?? 10)),
        },
      },
    };
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
      flagLocation: 'wfo',
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
    const savedAttendance = await this.attdModel.save(attd);

    const detail = this.detailsModel.create({
      id: uuidv4(),
      attdId: savedAttendance.id,
      inout: 'in',
      time: timeStr,
      remarks: dto.description,
      source: 'mobile', // ?? source ntar darimana ya?
      sourceReference: null,
      latitude: dto.latitude,
      longitude: dto.longitude,
      flagLocation: 'wfo',
      createdAt: new Date(),
      createdBy: empId,
    });

    await this.detailsModel.save(detail);

    return savedAttendance;
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
      where: { attdId: attendance.id, inout: 'out' },
    });

    if (outDetails >= 3) {
      throw new HttpException(
        { status: false, message: 'Already checked out 3 times', data: null },
        HttpStatus.FORBIDDEN,
      );
    }

    const detail = this.detailsModel.create({
      id: uuidv4(),
      attdId: attendance.id,
      inout: 'out',
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

  async getAttendanceDetail(empId: string, attendanceId: string) {
    const attendance = await this.attdModel.findOne({
      where: { id: attendanceId },
    });

    if (!attendance) {
      throw new NotFoundException({
        status: false,
        message: 'Attendance not found',
        data: null,
      });
    }

    const details = await this.detailsModel.find({
      where: { attdId: attendanceId },
      order: { time: 'ASC' },
    });

    return { attendance, details };
  }
}
