import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { differenceInHours, isBefore, isValid, parseISO } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { users } from 'generated/prisma';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FindAllBookingDto } from './dto/find-all-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateBookingDto, user: users) {
    const checkin = parseISO(body.checkinDate);
    const checkout = parseISO(body.checkoutDate);
    const now = new Date();

    // Validate format
    if (!isValid(checkin) || !isValid(checkout)) {
      throw new BadRequestException(
        'Ngày check-in hoặc check-out không đúng định dạng ISO: YYYY-MM-DDTHH:mm:ss.sssZ',
      );
    }

    // Validate logic ngày
    if (isBefore(checkout, checkin)) {
      throw new BadRequestException('Ngày check-out phải sau ngày check-in');
    }
    if (isBefore(checkin, now) || isBefore(checkout, now)) {
      throw new BadRequestException(
        'Ngày check-in và check-out phải lớn hơn thời điểm hiện tại',
      );
    }

    // Kiểm tra khoảng cách tối thiểu
    const minHours = 1;
    if (differenceInHours(checkout, checkin) < minHours) {
      throw new BadRequestException(
        `Thời gian đặt phòng phải ít nhất ${minHours} giờ`,
      );
    }

    const existingBooking = await this.prisma.bookings.findFirst({
      where: {
        roomId: body.roomId,
        userBookingId: user.id,
        isDeleted: false,
        OR: [
          {
            checkinDate: { lte: checkout },
            checkoutDate: { gte: checkin },
          },
        ],
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        `Bạn đã đặt phòng này cho khoảng thời gian từ ${existingBooking.checkinDate.toISOString()} đến ${existingBooking.checkoutDate.toISOString()}`,
      );
    }

    // Kiểm tra phòng và số lượng trống
    const [room, activeBookings] = await Promise.all([
      this.prisma.rooms.findUnique({
        where: { id: body.roomId },
        select: { so_khach: true, quantity: true, isDeleted: true },
      }),
      this.prisma.bookings.count({
        where: {
          roomId: body.roomId,
          isDeleted: false,
          OR: [
            {
              checkinDate: { lte: checkout },
              checkoutDate: { gte: checkin },
            },
          ],
        },
      }),
    ]);

    if (!room || room.isDeleted) {
      throw new NotFoundException(`Phòng với ID ${body.roomId} không tồn tại`);
    }
    if (body.so_khach > room.so_khach) {
      throw new BadRequestException(
        `Phòng chỉ cho phép tối đa ${room.so_khach} khách, bạn yêu cầu ${body.so_khach} khách`,
      );
    }
    if (activeBookings >= room.quantity) {
      throw new BadRequestException(
        `Không còn phòng trống cho loại phòng này trong khoảng thời gian từ ${body.checkinDate} đến ${body.checkoutDate}`,
      );
    }

    

    const booking = await this.prisma.bookings.create({
      data: {
        userBookingId: user.id,
        roomId: body.roomId,
        so_khach: body.so_khach,
        checkinDate: checkin,
        checkoutDate: checkout,
      },
    });

    return { message: 'Đặt phòng thành công', booking };
  }

  async findAll(query: FindAllBookingDto) {
    const {
      page = 1,
      pageSize = 10,
      userBookingId,
      roomId,
    } = query;

    const where: any = { isDeleted: false };

    if (userBookingId) {
      where.userBookingId = userBookingId;
    }
    if (roomId) {
      where.roomId = roomId;
    }

    const skip = (page - 1) * pageSize;

    const [bookings, totalItem] = await Promise.all([
      this.prisma.bookings.findMany({
        take: pageSize,
        skip,
        orderBy: { createdAt: 'desc' },
        where,
        include: {
          rooms: {
            select: { quantity: true },
          },
        },
      }),
      this.prisma.bookings.count({ where }),
    ]);

    // Tính số phòng trống cho mỗi booking
    const items = await Promise.all(
      bookings.map(async (booking) => {
        const activeBookings = await this.prisma.bookings.count({
          where: {
            roomId: booking.roomId,
            isDeleted: false,
            OR: [
              {
                checkinDate: { lte: booking.checkoutDate },
                checkoutDate: { gte: booking.checkinDate },
              },
            ],
          },
        });
        return {
          ...booking,
          availableRooms: booking.rooms.quantity - activeBookings,
        };
      }),
    );

    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      page,
      pageSize,
      totalItem,
      totalPage,
      items,
    };
  }

  async findOne(id: number) {
    const booking = await this.prisma.bookings.findUnique({
      where: {
        id: id,
        isDeleted: false,
    } });
    if (!booking || booking.isDeleted) {
      throw new NotFoundException(
        `Booking với ID ${id} không tồn tại hoặc đã bị xóa`,
      );
    }
    return booking;
  }

  async update(id: number, body: UpdateBookingDto, user: users) {
    const booking = await this.prisma.bookings.findUnique({ where: { id, isDeleted: false } });

    if (!booking || booking.isDeleted) {
      throw new NotFoundException(
        `Booking với ID ${id} không tồn tại hoặc đã bị xóa`,
      );
    }

    if (user.role !== 'admin' && booking.userBookingId !== user.id) {
      throw new ForbiddenException('Bạn không có quyền sửa booking này');
    }

    if (body.checkinDate || body.checkoutDate) {
      const checkin = parseISO(
        body.checkinDate ?? booking.checkinDate.toISOString(),
      );
      const checkout = parseISO(
        body.checkoutDate ?? booking.checkoutDate.toISOString(),
      );
      const now = new Date();

      if (!isValid(checkin) || !isValid(checkout)) {
        throw new BadRequestException(
          'Ngày check-in hoặc check-out không đúng định dạng ISO',
        );
      }
      if (isBefore(checkout, checkin)) {
        throw new BadRequestException('Ngày check-out phải sau ngày check-in');
      }
      if (isBefore(checkin, now) || isBefore(checkout, now)) {
        throw new BadRequestException(
          'Ngày check-in và check-out phải lớn hơn thời điểm hiện tại',
        );
      }

      const minHours = 1;
      if (differenceInHours(checkout, checkin) < minHours) {
        throw new BadRequestException(
          `Thời gian đặt phòng phải ít nhất ${minHours} giờ`,
        );
      }

      const [room, activeBookings] = await Promise.all([
        this.prisma.rooms.findUnique({
          where: { id: body.roomId ?? booking.roomId },
          select: { so_khach: true, quantity: true, isDeleted: true },
        }),
        this.prisma.bookings.count({
          where: {
            roomId: body.roomId ?? booking.roomId,
            id: { not: id }, // Bỏ qua booking hiện tại
            isDeleted: false,
            OR: [
              {
                checkinDate: { lte: checkout },
                checkoutDate: { gte: checkin },
              },
            ],
          },
        }),
      ]);

      if (!room || room.isDeleted) {
        throw new NotFoundException(
          `Phòng với ID ${body.roomId ?? booking.roomId} không tồn tại`,
        );
      }

      if (activeBookings >= room.quantity) {
        throw new BadRequestException(
          `Không còn phòng trống cho loại phòng này trong khoảng thời gian từ ${checkin.toISOString()} đến ${checkout.toISOString()}`,
        );
      }
    }

    if (body.so_khach !== undefined) {
      const room = await this.prisma.rooms.findUnique({
        where: { id: body.roomId ?? booking.roomId },
        select: { so_khach: true, isDeleted: true },
      });
      if (!room || room.isDeleted) {
        throw new NotFoundException(
          `Phòng với ID ${body.roomId ?? booking.roomId} không tồn tại`,
        );
      }
      if (body.so_khach > room.so_khach) {
        throw new BadRequestException(
          `Phòng chỉ cho phép tối đa ${room.so_khach} khách, bạn yêu cầu ${body.so_khach} khách`,
        );
      }
    }

    const updateBooking = await this.prisma.bookings.update({
      where: { id },
      data: body,
    });
    return { message: 'Sửa đặt phòng thành công', booking: updateBooking };
  }

  async checkAvailability(
    roomId: number,
    checkinDate: string,
    checkoutDate: string,
  ) {
    const checkin = parseISO(checkinDate);
    const checkout = parseISO(checkoutDate);
    const now = new Date();

    if (!isValid(checkin) || !isValid(checkout)) {
      throw new BadRequestException(
        'Ngày check-in hoặc check-out không đúng định dạng (YYYY-MM-DD)',
      );
    }

    if (isBefore(checkin, now) || isBefore(checkout, now)) {
      throw new BadRequestException(
        'Ngày check-in và check-out phải lớn hơn thời điểm hiện tại',
      );
    }

    if (isBefore(checkout, checkin)) {
      throw new BadRequestException('Ngày check-out phải sau ngày check-in');
    }

    const [room, activeBookings] = await Promise.all([
      this.prisma.rooms.findUnique({
        where: { id: roomId },
        select: { quantity: true, isDeleted: true },
      }),
      this.prisma.bookings.count({
        where: {
          roomId,
          isDeleted: false,
          OR: [
            { checkinDate: { lte: checkout }, checkoutDate: { gte: checkin } },
          ],
        },
      }),
    ]);

    if (!room || room.isDeleted) {
      throw new NotFoundException(
        `Phòng với ID ${roomId} không tồn tại hoặc đã bị xóa`,
      );
    }

    return {
      roomId,
      availableRooms: room.quantity - activeBookings,
      checkinDate,
      checkoutDate,
    };
  }

  async remove(id: number, user: users) {
    const booking = await this.prisma.bookings.findUnique({ where: { id } });

    if (!booking || booking.isDeleted) {
      throw new NotFoundException(
        `Booking với ID ${id} không tồn tại hoặc đã bị xóa`,
      );
    }

    if (user.role !== 'admin' && booking.userBookingId !== user.id) {
      throw new ForbiddenException('Bạn không có quyền xóa booking này');
    }

    const deleteBooking = await this.prisma.bookings.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user.id,
      },
    });
    return { message: 'Xóa đặt phòng thành công', booking: deleteBooking };
  }
}
