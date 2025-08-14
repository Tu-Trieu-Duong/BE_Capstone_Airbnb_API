import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class FindAllCommentDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 1,
  })
  page?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 10,
  })
  pageSize?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Lọc bình luận theo ID phòng',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  roomId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Lọc bình luận theo ID phòng',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userCommentId?: number;
}
