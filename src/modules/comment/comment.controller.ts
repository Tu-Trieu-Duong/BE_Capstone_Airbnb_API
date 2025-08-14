import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/common/decorator/user.decorator';
import { users } from 'generated/prisma';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/is-public.decorator';
import { FindAllCommentDto } from './dto/find-all-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() body: CreateCommentDto, @User() user: users) {
    return this.commentService.create(body, user);
  }

  @Public()
  @Get()
  findAll(@Query() query: FindAllCommentDto) {
    return this.commentService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @ApiBearerAuth()
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateCommentDto, @User() user: users) {
    return this.commentService.update(+id, body, user);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: users) {
    return this.commentService.remove(+id, user);
  }
}
