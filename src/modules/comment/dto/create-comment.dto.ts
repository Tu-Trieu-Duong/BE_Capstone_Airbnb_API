import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
    description: 'ID của phòng được bình luận',
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  roomId: number;

  @ApiProperty({
    example: 'Phòng rất sạch sẽ và tiện nghi!',
    description: 'Nội dung bình luận',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    example: 5,
    description: 'Điểm đánh giá (1-5 sao)',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  star_comment: number;
}
