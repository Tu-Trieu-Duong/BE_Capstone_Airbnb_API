import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
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
}
