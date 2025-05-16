import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from './entities/attendance.entity';
import { AttendanceController } from './attendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceEntity])],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
