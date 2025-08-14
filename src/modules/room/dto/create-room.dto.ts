import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Phòng Deluxe' })
  @IsNotEmpty()
  @IsString()
  ten_phong: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  so_khach: number;

  @ApiProperty({ example: 2 })
  @Min(1)
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  phong_ngu: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  @IsInt()
  giuong: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  @IsInt()
  phong_tam: number;

  @ApiPropertyOptional({ example: 'Phòng rộng, có ban công...' })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiProperty({ example: 500000 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  gia_tien: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  may_giat?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  ban_la?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  tivi?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  dieu_hoa?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  wifi?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  bep?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  do_xe?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  ho_boi?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  ban_ui?: boolean;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  locationId: number;
}
