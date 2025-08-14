import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllRoomDto } from './dto/find-all-room.dto';
import { users } from 'generated/prisma';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}
  async create(body: CreateRoomDto) {
    const existing = await this.prisma.rooms.findFirst({
      where: {
        ten_phong: body.ten_phong,
        isDeleted: false,
      },
    });
    if (existing) {
      throw new BadRequestException('Phòng này đã tồn tại');
    }

    const room = await this.prisma.rooms.create({ data: body });

    return { message: 'Tạo phòng thành công', room: room };
  }

  async findAll(query: FindAllRoomDto) {
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
        parsedKeyword[key] = { contains: value};
      }
    });

    const where = {
      isDeleted: false,
      ...parsedKeyword,
    };
    const skip = (page - 1) * pageSize;

    const room = await this.prisma.rooms.findMany({
      take: pageSize,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
      where: where,
    });

    const totalItem = await this.prisma.rooms.count({
      where: where,
    });
    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: room,
    };
  }

  async findOne(id: number) {
    const room = await this.prisma.rooms.findUnique({ where: { id, isDeleted: false } });
    if (!room || room.isDeleted) {
      throw new NotFoundException(
        `Phòng với ID ${id} không tồn tại hoặc đã bị xóa`,
      );
    }
    return room;
  }

  async update(id: number, body: UpdateRoomDto, user: users) {
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện chức năng này',
      );
    }

    const room = await this.prisma.rooms.findUnique({ where: { id } });

    if (!room || room.isDeleted) {
      throw new NotFoundException(
        `Phòng với ID ${id} không tồn tại hoặc đã bị xóa`,
      );
    }

    if (body.quantity !== undefined) {
      const now = new Date();

      // Kiểm tra số booking hiện tại (đang phục vụ)
      const currentBookings = await this.prisma.bookings.count({
        where: {
          roomId: id,
          isDeleted: false,
          checkinDate: { lte: now },
          checkoutDate: { gte: now },
        },
      });

      if (body.quantity < currentBookings) {
        throw new BadRequestException(
          `Số lượng phòng mới (${body.quantity}) không đủ để đáp ứng ${currentBookings} booking đang phục vụ`,
        );
      }

      // Kiểm tra số booking trùng tối đa trong tương lai
      const futureBookings = await this.prisma.bookings.findMany({
        where: {
          roomId: id,
          isDeleted: false,
          checkinDate: { gte: now },
        },
        select: {
          checkinDate: true,
          checkoutDate: true,
        },
      });

      let maxOverlappingBookings = 0;
      for (const booking of futureBookings) {
        const overlappingBookings = await this.prisma.bookings.count({
          where: {
            roomId: id,
            isDeleted: false,
            OR: [
              {
                checkinDate: { lte: booking.checkoutDate },
                checkoutDate: { gte: booking.checkinDate },
              },
            ],
          },
        });
        maxOverlappingBookings = Math.max(
          maxOverlappingBookings,
          overlappingBookings,
        );
      }

      if (body.quantity < maxOverlappingBookings) {
        throw new BadRequestException(
          `Số lượng phòng mới (${body.quantity}) không đủ để đáp ứng ${maxOverlappingBookings} booking trùng lặp trong tương lai`,
        );
      }
    }

    const updateRoom = await this.prisma.rooms.update({
      where: { id },
      data: body,
    });

    return { message: 'Cập nhật phòng thành công', room: updateRoom };
  }

  async uploadImages(files: Express.Multer.File[], id: number) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Chưa tìm thấy file');
    }

    const room = await this.prisma.rooms.findUnique({ where: { id } });
    if (!room || room.isDeleted) {
      throw new BadRequestException(
        `Phòng với ID ${id} không tồn tại hoặc đã bị xóa`,
      );
    }

    try {
      // Lưu nhiều ảnh vào bảng room_images
      const imagesData = files.map((file) => ({
        room_id: id,
        image_url: file.filename,
      }));

      await this.prisma.room_images.createMany({
        data: imagesData,
      });

      return {
        message: 'Tải ảnh phòng thành công',
        roomId: id,
        totalUploaded: files.length,
        files: files.map((file) => ({
          filename: file.filename,
          imgUrl: `images/${file.filename}`,
        })),
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async deletePicture(imageId: number) {
    const image = await this.prisma.room_images.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Ảnh với ID ${imageId} không tồn tại`);
    }

    // Xóa file vật lý
    const filePath = path.join('images', image.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Xóa bản ghi DB
    await this.prisma.room_images.delete({
      where: { id: imageId },
    });

    return { message: 'Xóa ảnh thành công', imageId };
  }

  async remove(id: number, user: users) {
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện chức năng này',
      );
    }

    const room = await this.prisma.rooms.findUnique({ where: { id } });
    if (!room || room.isDeleted) {
      throw new NotFoundException(
        `Phòng với ID ${id} không tồn tại hoặc đã bị xóa`,
      );
    }

    const deletedRoom = await this.prisma.rooms.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user.id,
      },
    });
    return { message: 'Xóa phòng thành công', room: deletedRoom };
  }
}
