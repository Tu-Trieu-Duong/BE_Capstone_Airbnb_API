import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'tutrieuduong@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123aA@',
  })
  password: string;

  @IsString()
  @ApiProperty({
    example: 'Nguyen Van A',
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: '0123456789',
  })
  phone: string;

  @IsDateString()
  @ApiProperty({
    example: '2000-01-01',
  })
  birth_day: string;

  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  gender: boolean;
}
