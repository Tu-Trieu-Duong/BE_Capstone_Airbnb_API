import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ example: 'Ho Chi Minh City' })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  name_location?: string;

  @ApiProperty({ example: 'Ho Chi Minh' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty({ example: 'Vietnam' })
  @IsOptional()
  @IsString()
  country?: string;
}
