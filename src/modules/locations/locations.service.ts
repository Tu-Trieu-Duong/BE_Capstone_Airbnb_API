import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllLocationDto } from './dto/find-all-location.dto';
import { locations, users } from 'generated/prisma';
import * as path from 'path';
import * as fs from 'fs';
import { cloudinary } from 'src/common/cloudinary/init.cloudinary';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(body: CreateLocationDto) {
    const existing = await this.prisma.locations.findFirst({
      where: {
        name_location: body.name_location,
        isDeleted: false,
      },
    });

    if (existing) {
      throw new BadRequestException('Vị trí này đã tồn tại');
    }
    const location = await this.prisma.locations.create({ data: body });
    return { message: 'Tạo thành công', location: location };
  }

  async findAll(query: FindAllLocationDto) {
    let { page = 1, pageSize = 10, keyword } = query;

    let parsedKeyword: Record<string, any> = {};
    try {
      parsedKeyword = keyword ? JSON.parse(keyword) : {};
    } catch (error) {
      throw new BadRequestException('filters phải là chuỗi JSON hợp lệ.');
    }

    Object.entries(parsedKeyword).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        delete parsedKeyword[key];
        return;
      } else if (typeof value === 'string') {
        parsedKeyword[key] = { contains: value, mode: 'insensitive' };
      }
    });

    const where = {
      isDeleted: false,
      ...parsedKeyword,
    };
    const skip = (page - 1) * pageSize;

    const location = await this.prisma.locations.findMany({
      take: pageSize,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
      where: where,
    });

    const totalItem = await this.prisma.locations.count({
      where: where,
    });
    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: location,
    };
  }

  async findOne(id: number) {
    const location = await this.prisma.locations.findUnique({ where: { id } });
    if (!location || location.isDeleted) {
      throw new NotFoundException('Không tìm thấy vị trí');
    }
    return location;
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
    currentUser: users,
  ) {
    const isAdmin = currentUser.role === 'admin';
    if (!isAdmin) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện chức năng này',
      );
    }

    if (updateLocationDto.name_location) {
      const existing = await this.prisma.locations.findFirst({
        where: {
          name_location: updateLocationDto.name_location,
          id: { not: id },
          isDeleted: false,
        },
      });

      if (existing) {
        throw new BadRequestException('Vị trí này đã tồn tại');
      }
    }

    const location = await this.prisma.locations.findUnique({ where: { id } });

    if (!location || location.isDeleted) {
      throw new NotFoundException('Vị trí này không tồn tại');
    }

    const updateLocation = await this.prisma.locations.update({
      where: { id },
      data: updateLocationDto,
    });

    return updateLocation;
  }

  async uploadImage(file: Express.Multer.File, id: number) {
    if (!file) {
      throw new BadRequestException('Chưa tìm thấy file');
    }

    const picture = await this.prisma.locations.findUnique({ where: { id } });

    if (!picture) {
      throw new BadRequestException('Chưa tìm thấy vị trí');
    }

    try {
      await this.prisma.locations.update({
        where: {
          id: Number(picture.id),
        },
        data: {
          picture: file.filename,
        },
      });

      if (picture.picture) {
        const oldFilePath = path.join('images', picture.picture);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
        cloudinary.uploader.destroy(picture.picture);
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Cập nhật hình ảnh vị trí thành công',
      locationId: picture.id,
      folder: 'images/',
      filename: file.filename,
      imgUrl: `images/${file.filename}`,
    };
  }

  async remove(id: number, currentUser: users) {
    const isAdmin = currentUser.role === 'admin';

    if (!isAdmin) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện chức năng này',
      );
    }

    const location = await this.prisma.locations.findUnique({ where: { id } });
    if (!location || location.isDeleted) {
      throw new NotFoundException('Vị trí này không tồn tại');
    }

    const deletedLocation = await this.prisma.locations.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: currentUser.id,
      },
    });
    return { message: 'Xóa vị trí thành công', location: deletedLocation };
  }
}
