import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User } from 'src/common/decorator/user.decorator';
import { users } from 'generated/prisma';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/is-public.decorator';
import { FindAllBookingDto } from './dto/find-all-booking.dto';
import {  CheckAvailableRoomDto } from './dto/check-available-room.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() body: CreateBookingDto, @User() user: users) {
    return this.bookingService.create(body, user);
  }

  @Public()
  @Get()
  findAll(@Query() query: FindAllBookingDto) {
    return this.bookingService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @ApiBearerAuth()
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateBookingDto,
    @User() user: users,
  ) {
    return this.bookingService.update(+id, body, user);
  }

  @Public()
  @Get('check/availableRooms')
  checkAvailableRoom(@Query() query: CheckAvailableRoomDto) {
    return this.bookingService.checkAvailableRoom(
      +query.roomId,
      query.checkinDate,
      query.checkoutDate,
    );
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: users) {
    return this.bookingService.remove(+id, user);
  }
}
