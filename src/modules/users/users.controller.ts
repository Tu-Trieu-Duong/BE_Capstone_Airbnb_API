import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { FindAllDto } from './dto/find-all-user.dto';
import { User } from 'src/common/decorator/user.decorator';
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
  @UseGuards(ProtectGuard, RolesGuard)
  update(
    @User() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto, user);
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
  @UseGuards(ProtectGuard, RolesGuard)
  remove(@User() user, @Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id, user);
  }
}
