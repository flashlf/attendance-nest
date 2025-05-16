import { IsString } from 'class-validator';

export class CheckInDto {
  @IsString()
  timezone: string;

  @IsString()
  description: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;
}
