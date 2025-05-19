import {
  Controller,
  Post,
  Get,
  Req,
  HttpException,
  HttpStatus,
  Body,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Request } from 'express';
import { CheckInDto } from './dto/check-in.dto';
import { AttendanceQueryDto } from './dto/attendance-quey.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Get('validation')
  async attendanceValidation(@Req() req: Request) {
    const user = req.user as any;
    const empId = user.empId;
    const today = new Date().toISOString().slice(0, 10);

    try {
      await this.attendanceService.validateAttendance(empId, today);
      return { status: true, message: 'OK', data: null };
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('in')
  async checkIn(@Req() req: Request, @Body() dto: CheckInDto) {
    const user = req.user as any;
    const empId = user.empId;

    console.info(empId);
    console.info(dto);
    try {
      const attendance = await this.attendanceService.checkIn(empId, dto);
      return { status: true, message: 'OK', data: attendance };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        { status: false, message: 'Internal Server Error ', data: null },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('out')
  async checkOut(@Req() req: Request, @Body() dto: CheckInDto) {
    const user = req.user as any;
    const empId = user.empId;

    try {
      const result = await this.attendanceService.checkOut(empId, dto);
      return {
        status: true,
        message: 'Success',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        { status: false, message: 'Internal Server Error', data: null },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: Request, @Query() query: AttendanceQueryDto) {
    const user = req.user as any;
    const empId = user?.empId;
    return this.attendanceService.findAllAttendance({ ...query, empId });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDetailsById(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;
    const empId = user.empId;
    try {
      const result = await this.attendanceService.getAttendanceDetail(
        empId,
        id,
      );
      return {
        status: true,
        message: 'Success',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: false,
          message: `Internal Server Error`,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
