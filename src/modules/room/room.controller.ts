import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FindAllRoomDto } from './dto/find-all-room.dto';
import { User } from 'src/common/decorator/user.decorator';
import { users } from 'generated/prisma';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/protect/role.guard';
import { Public } from 'src/common/decorator/is-public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadLocal } from 'src/common/multer/local.multer';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() body: CreateRoomDto) {
    return this.roomService.create(body);
  }

  @Public()
  @Get()
  findAll(@Query() query: FindAllRoomDto) {
    return this.roomService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateRoomDto,
    @User() user: users,
  ) {
    return this.roomService.update(+id, body, user);
  }

  @ApiBearerAuth()
  @Put('upload/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pictures: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('pictures', 10, uploadLocal))
  upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.roomService.uploadImages(files, id);
  }

  @ApiBearerAuth()
  @Delete('picture/:imageId')
  @Roles('admin')
  @UseGuards(RolesGuard)
  deletePicture(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.roomService.deletePicture(imageId);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string, @User() user: users) {
    return this.roomService.remove(+id, user);
  }
}
