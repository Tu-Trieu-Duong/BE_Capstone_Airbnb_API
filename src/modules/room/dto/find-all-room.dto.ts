import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllRoomDto {
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
    example: '{"ten_phong": "Luxury"}',
    description: `Tìm kiếm nâng cao theo nhiều trường (định dạng JSON string). Có thể tìm theo:
        
    - Kiểu String: ten_phong; mo_ta

    - Kiểu number: so_khach; phong_ngu; giuong; phong_tam; gia_tien; locationId
    
    - Kiểu boolean: may_giat; ban_la; tivi; dieu_hoa; wifi; bep; do_xe; ho_boi; ban_ui

    Lưu ý: Đây là một chuỗi JSON chứ không phải object thực. Ví dụ: '{"ten_phong": "Luxury", "so_khach": 4, "wifi": true}'`,
  })
  keyword?: string;
}
