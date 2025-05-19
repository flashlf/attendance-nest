import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from './entities/attendance.entity';
import { AttendanceController } from './attendance.controller';
import { AttendanceDetailEntity } from './entities/attendance-detail.entity';
import { AttdTypeEntity } from './entities/attd-type.entity';
import { AttdConfirmationRequestEntity } from './entities/attd-confirmation-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttendanceEntity,
      AttendanceDetailEntity,
      AttdTypeEntity,
      AttdConfirmationRequestEntity,
    ]),
  ],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
