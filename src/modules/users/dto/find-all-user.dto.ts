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
    example: '{"name": "John", "email": "john@example.com", "phone": "0123"}',
    description: `Tìm kiếm nâng cao theo nhiều trường (định dạng JSON string). Có thể tìm theo:
- name (tên)
- email (địa chỉ email)
- phone (số điện thoại)
- gender (giới tính: nam (true), nữ (false))
- role (vai trò: admin/user)

Lưu ý: Đây là một chuỗi JSON chứ không phải object thực. Ví dụ: '{"name":"John"}'`,
  })
  keyword: string;
}
