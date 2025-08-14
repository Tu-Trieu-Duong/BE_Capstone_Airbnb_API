import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  roomId: number;

  @ApiProperty({
    example: 2,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  so_khach: number;

  @ApiProperty({
    example: '2025-01-01T12:00:00.000Z',
    description: 'Ngày đặt phòng: YYYY-MM-DDThh:mm:ss.sssZ',
  })
  @IsNotEmpty()
  @IsDateString()
  checkinDate: string;

  @ApiProperty({
    example: '2025-01-01T14:00:00.000Z',
    description: 'Ngày trả phòng: YYYY-MM-DDThh:mm:ss.sssZ',
  })
  @IsNotEmpty()
  @IsDateString()
  checkoutDate: string;
}
