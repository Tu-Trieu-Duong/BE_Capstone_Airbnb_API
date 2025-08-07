import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { UserRole } from './user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Nguyen Van A',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '0123456789',
  })
  phone?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '2000-01-01',
  })
  birth_day?: string;

  @ApiPropertyOptional({
    description: 'Giới tính: true = Nam, false = Nữ',
    type: Boolean,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  gender?: boolean;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Vai trò của người dùng',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
