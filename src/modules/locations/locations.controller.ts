import { locations } from './../../../generated/prisma/index.d';
import { ProtectGuard } from 'src/common/protect/protect.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FindAllLocationDto } from './dto/find-all-location.dto';
import { Public } from 'src/common/decorator/is-public.decorator';
import { RolesGuard } from 'src/common/protect/role.guard';
import { User } from 'src/common/decorator/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadLocal } from 'src/common/multer/local.multer';
import { Roles } from 'src/common/decorator/role.decorator';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() body: CreateLocationDto) {
    return this.locationsService.create(body);
  }

  @Public()
  @Get()
  findAll(@Query() query: FindAllLocationDto) {
    return this.locationsService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
    @User() user,
  ) {
    return this.locationsService.update(+id, updateLocationDto, user);
  }

  @ApiBearerAuth()
  @Put('upload/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        picture: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('picture', uploadLocal))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.locationsService.uploadImage(file, id);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  remove(@User() user, @Param('id', ParseIntPipe) id: number) {
    return this.locationsService.remove(+id, user);
  }
}
