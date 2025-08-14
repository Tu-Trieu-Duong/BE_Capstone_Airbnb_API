import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CheckAvailableRoomDto {
  @ApiProperty({
    example: 1,
    description: 'ID của phòng cần kiểm tra',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  roomId: number;

  @ApiProperty({
    example: '2025-08-14T12:00:00.000Z',
    description: 'Ngày check-in (định dạng ISO: YYYY-MM-DDThh:mm:ss.sssZ)',
  })
  @IsNotEmpty()
  @IsString()
  checkinDate: string;

  @ApiProperty({
    example: '2025-08-15T12:00:00.000Z',
    description: 'Ngày check-out (định dạng ISO: YYYY-MM-DDThh:mm:ss.sssZ)',
  })
  @IsNotEmpty()
  @IsString()
  checkoutDate: string;
}
