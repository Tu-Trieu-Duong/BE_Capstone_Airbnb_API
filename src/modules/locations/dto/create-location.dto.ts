import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateLocationDto {
  @ApiProperty({ example: 'Ho Chi Minh City' })
  @IsNotEmpty()
  @IsString()
  name_location?: string;

  @ApiProperty({ example: 'Ho Chi Minh' })
  @IsString()
  province?: string;

  @ApiProperty({ example: 'Vietnam' })
  @IsString()
  country?: string;
}
