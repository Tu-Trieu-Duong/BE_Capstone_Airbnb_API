import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { users } from 'generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllCommentDto } from './dto/find-all-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateCommentDto, user: users) {
    const room = await this.prisma.rooms.findUnique({
      where: { id: body.roomId, isDeleted: false },
    });

    if (!room) {
      throw new NotFoundException(
        `Phòng với Id ${body.roomId} không tồn tại hoặc đã bị xóa`,
      );
    }

    const hasBooking = await this.prisma.bookings.findFirst({
      where: {
        roomId: body.roomId,
        userBookingId: user.id,
        isDeleted: false,
      },
    });

    if (!hasBooking) {
      throw new BadRequestException(
        'Bạn cần đặt phòng này trước khi bình luận',
      );
    }

    const comment = await this.prisma.comments.create({
      data: {
        roomId: body.roomId,
        comment: body.comment,
        star_comment: body.star_comment,
        userCommentId: user.id,
        isActive: true,
      },
      select: {
        id: true,
        roomId: true,
        userCommentId: true,
        comment: true,
        star_comment: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { message: 'Tạo bình luận thành công', comment };
  }

  async findAll(query: FindAllCommentDto) {
    let { page = 1, pageSize = 10, roomId, userCommentId } = query;
    page = Math.max(1, page);
    pageSize = Math.max(1, Math.min(pageSize, 100));

    const where: {
      isDeleted: boolean;
      userCommentId?: number;
      roomId?: number;
    } = { isDeleted: false };
    if (userCommentId) where.userCommentId = userCommentId;
    if (roomId) where.roomId = roomId;

    const skip = (page - 1) * pageSize;

    const comments = await this.prisma.comments.findMany({
      take: pageSize,
      skip,
      orderBy: { createdAt: 'desc' },
      where,
      select: {
        id: true,
        roomId: true,
        userCommentId: true,
        comment: true,
        star_comment: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalItem = await this.prisma.comments.count({ where });
    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      page,
      pageSize,
      totalItem,
      totalPage,
      items: comments,
    };
  }

  async findOne(id: number) {
    const comment = await this.prisma.comments.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        roomId: true,
        userCommentId: true,
        comment: true,
        star_comment: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(`Bình luận không tồn tại hoặc đã bị xóa`);
    }

    return comment;
  }

  async update(id: number, body: UpdateCommentDto, user: users) {
    const comment = await this.prisma.comments.findUnique({
      where: { id, isDeleted: false },
    });

    if (!comment) {
      throw new NotFoundException(`Bình luận không tồn tại hoặc đã bị xóa`);
    }

    if (user.role !== 'admin' && comment.userCommentId !== user.id) {
      throw new ForbiddenException('Bạn không có quyền sửa bình luận này');
    }

    if (body.roomId) {
      const room = await this.prisma.rooms.findUnique({
        where: { id: body.roomId, isDeleted: false },
      });
      if (!room) {
        throw new NotFoundException(
          `Phòng với Id ${body.roomId} không tồn tại hoặc đã bị xóa`,
        );
      }
      const hasBooking = await this.prisma.bookings.findFirst({
        where: {
          roomId: body.roomId,
          userBookingId: user.id,
          isDeleted: false,
        },
      });
      if (!hasBooking) {
        throw new BadRequestException(
          'Bạn cần đặt phòng này trước khi bình luận',
        );
      }
    }

    const updateComment = await this.prisma.comments.update({
      where: { id },
      data: {
        roomId: body.roomId,
        comment: body.comment,
        star_comment: body.star_comment,
      },
      select: {
        id: true,
        roomId: true,
        userCommentId: true,
        comment: true,
        star_comment: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { message: 'Sửa bình luận thành công', comment: updateComment };
  }

  async remove(id: number, user: users) {
    const comment = await this.prisma.comments.findUnique({
      where: { id, isDeleted: false },
    });

    if (!comment) {
      throw new NotFoundException(`Bình luận không tồn tại hoặc đã được xóa`);
    }

    if (user.role !== 'admin' && comment.userCommentId !== user.id) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    const deleteComment = await this.prisma.comments.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedBy: user.id,
      },
      select: {
        id: true,
        roomId: true,
        userCommentId: true,
        comment: true,
        star_comment: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return { message: 'Xóa bình luận thành công', comment: deleteComment };
  }
}
