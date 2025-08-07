import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from './user-role.enum';

export class CreateUserDto {
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
    description: 'Giới tính: true = Nam, false = Nữ',
    type: Boolean,
    default: true,
  })
  gender: boolean;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Vai trò của người dùng',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
} 
