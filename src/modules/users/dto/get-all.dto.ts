import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllDto {
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

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '{"name": "John"}',
  })
  keyword: string;
}
