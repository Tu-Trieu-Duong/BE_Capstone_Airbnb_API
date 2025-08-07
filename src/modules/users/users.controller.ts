import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe, Put, ForbiddenException, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { FindAllDto } from './dto/get-all.dto';
import { User } from 'src/common/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorator/role.decorator';
import { ProtectGuard } from 'src/common/protect/protect.guard';
import { RolesGuard } from 'src/common/protect/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadLocal } from 'src/common/multer/local.multer';
import { users } from 'generated/prisma';
import { memoryStorage } from 'multer';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: FindAllDto) {
    return this.usersService.findAll(query);
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  @UseGuards(ProtectGuard, RolesGuard)
  async update(
    @User() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const isSelf = user.id === id;
    const isAdmin = user.role === 'admin';

    console.log({ isSelf, isAdmin });

    if (!isAdmin && dto.role && dto.role === 'admin') {
      throw new ForbiddenException('Bạn không được phép chỉnh sửa quyền admin');
    }

    if (!isSelf && !isAdmin) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật thông tin người khác',
      );
    }

    return this.usersService.update(id, dto);
  }

  @Post('avatar-local')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar', uploadLocal))
  avatarLocal(@UploadedFile() file: Express.Multer.File, @User() user: users) {
    return this.usersService.avatarLocal(file, user);
  }

  @Post('avatar-cloud')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  avatarCloud(@UploadedFile() file: Express.Multer.File, @User() user: users) {
    console.log('File nhận được:', file);
    return this.usersService.avatarCloud(file, user);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  @UseGuards(ProtectGuard, RolesGuard)
  async remove(@User() user, @Param('id', ParseIntPipe) id: number) {
    const isSelf = user.id === id;
    const isAdmin = user.role === 'admin';

    if (!isSelf && !isAdmin) {
      throw new ForbiddenException('Bạn không có quyền xóa người dùng này');
    }

    return this.usersService.remove(id, user.id);
  }
}
