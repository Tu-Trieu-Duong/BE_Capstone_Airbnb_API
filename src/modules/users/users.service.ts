import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from './dto/user-role.enum';
import { FindAllDto } from './dto/find-all-user.dto';
import { cloudinary } from 'src/common/cloudinary/init.cloudinary';
import * as path from 'path';
import * as fs from 'fs';
import { users } from 'generated/prisma';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(body: CreateUserDto) {
    const { email, password, name, phone, birth_day, gender, role } = body;
    const userRole = role ?? UserRole.USER;

    if (!email || !password) {
      throw new BadRequestException('Vui lòng điền đầy đủ thông tin đăng ký');
    }

    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    // Nếu user đã tồn tại và chưa bị xóa → báo lỗi
    if (existingUser && !existingUser.isDeleted) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    // Nếu user bị xóa mềm → khôi phục
    if (existingUser && existingUser.isDeleted) {
      const updatedUser = await this.prisma.users.update({
        where: { id: existingUser.id },
        data: {
          name,
          email,
          pass_word: bcrypt.hashSync(password, 10),
          phone,
          birth_day,
          gender,
          role,
          isDeleted: false,
          deletedAt: null,
          deletedBy: 0,
        },
      });

      const { pass_word: _, ...rest } = updatedUser;
      return {
        message: 'Khôi phục tài khoản và đăng ký lại thành công',
        user: rest,
      };
    }

    const userNew = await this.prisma.users.create({
      data: {
        name,
        email,
        pass_word: bcrypt.hashSync(password, 10),
        phone,
        birth_day,
        gender,
        role: userRole || 'user',
      },
    });

    const { pass_word: _, ...userWithoutPassword } = userNew;

    return {
      message: 'Đăng ký thành công',
      user: userWithoutPassword,
    };
  }

  async findAll(query: FindAllDto) {
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
        parsedKeyword[key] = { contains: value };
      }
    });

    const where = {
      isDeleted: false,
      ...parsedKeyword,
    };
    const skip = (page - 1) * pageSize;

    const users = await this.prisma.users.findMany({
      take: pageSize,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
      where: where,
    });

    const usersWithoutPassword = users.map(({ pass_word, ...rest }) => rest);

    const totalItem = await this.prisma.users.count({
      where: where,
    });
    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: usersWithoutPassword,
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const { pass_word, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, dto: UpdateUserDto, currentUser: users) {
    const isSelf = currentUser.id === id;
    const isAdmin = currentUser.role === 'admin';

    if (!isSelf && !isAdmin) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật người dùng này',
      );
    }

    if (!isAdmin && dto.role === UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không được phép chỉnh sửa quyền admin');
    }

    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user || user.isDeleted) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: dto,
    });

    const { pass_word, ...userWithoutPassword } = updatedUser;
    return {
      message: 'Cập nhật thông tin người dùng thành công',
      user: userWithoutPassword,
    };
  }

  async avatarLocal(file: Express.Multer.File, user: users) {
    if (!file) {
      throw new BadRequestException('Chưa tìm thấy file');
    }

    if (!user) {
      throw new BadRequestException('Chưa tìm thấy user');
    }

    try {
      await this.prisma.users.update({
        where: {
          id: Number(user.id),
        },
        data: {
          avatar: file.filename,
        },
      });

      if (user.avatar) {
        const oldFilePath = path.join('images', user.avatar);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
        cloudinary.uploader.destroy(user.avatar);
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Cập nhật avatar thành công',
      userId: user.id,
      folder: 'images/',
      filename: file.filename,
      imgUrl: `images/${file.filename}`,
    };
  }

  async avatarCloud(file: Express.Multer.File, user: users) {
    if (!file) {
      throw new BadRequestException('Chưa tìm thấy file');
    }

    if (!user) {
      throw new BadRequestException('Chưa tìm thấy user');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('File không hợp lệ');
    }

    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'images',
              transformation: [{ width: 1024, crop: 'limit' }],
            },
            (error, result) => {
              if (error || !result) {
                console.error('Upload lỗi Cloudinary:', error);
                return reject(new BadRequestException('Upload ảnh thất bại'));
              }
              resolve(result);
            },
          )
          .end(file.buffer);
      },
    );

    if (uploadResult === undefined) {
      throw new BadRequestException('Chưa tìm thấy file');
    }

    console.log({ uploadResult });

    try {
      await this.prisma.users.update({
        where: {
          id: Number(user.id),
        },
        data: {
          avatar: uploadResult.public_id,
        },
      });

      if (user.avatar) {
        const oldFilePath = path.join('images', user.avatar);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
        cloudinary.uploader.destroy(user.avatar);
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Cập nhật avatar thành công',
      userId: user.id,
      folder: uploadResult.folder,
      filename: file.originalname,
      imgUrl: uploadResult.secure_url,
    };
  }

  async remove(id: number, currentUser: users) {
    const isSelf = currentUser.id === id;
    const isAdmin = currentUser.role === 'admin';

    if (!isSelf && !isAdmin) {
      throw new ForbiddenException('Bạn không có quyền xóa người dùng này');
    }

    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user || user.isDeleted) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const deletedUser = await this.prisma.users.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: currentUser.id,
      },
    });

    const { pass_word, ...userWithoutPassword } = deletedUser;
    return {
      message: 'Xóa người dùng thành công',
      user: userWithoutPassword,
    };
  }
}
