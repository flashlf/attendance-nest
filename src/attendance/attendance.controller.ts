import {
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('/attendance')
export class AttendanceController {
  constructor() { }

  @Get('/validation')
  async attendanceValidation(@Req() req: Request) {
    const user = req.user as any;
    const empId = user.empId;
    const today = new Date().toISOString().slice(0, 10);

    const attdExist = await this.AttendanceService.findByEmpIdAndDate(
      empId,
      today,
    );

    if (!attdExist) {
      return {
        status: true,
        message: 'OK',
        data: null,
      };
    }

    throw new HttpException(
      status: false,
      message: 'Already Checked In',
      data: attdExist,
      },
      HttpStatus.FORBIDDEN,
    );
  return;
}
}
