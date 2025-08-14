import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllLocationDto {
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
    example: '{"name_location": "Ho Chi Minh"}',
    description: `Tìm kiếm nâng cao theo nhiều trường (định dạng JSON string). Có thể tìm theo:
- name_location (tên vị trí)
- province (tỉnh)
- country (quốc gia)

Lưu ý: Đây là một chuỗi JSON chứ không phải object thực. Ví dụ: '{"name_location": "Ho Chi Minh", "province": "Ho Chi Minh", "country": "Vietnam"}'`,
  })
  keyword?: string;
}
