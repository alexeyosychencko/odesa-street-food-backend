import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { JwtAuthGuard } from 'src/strategies/jwt.strategy';
import { ValidationPipe } from '../pipes/validation.pipe';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body(new ValidationPipe()) dto: CreatePostDto,
    @UploadedFile() image,
  ) {
    return await this.postService.create(dto, image);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.postService.delete(id);
    if (!deleted) {
      throw new HttpException('Not found post.', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: CreatePostDto,
    @UploadedFile() image,
  ) {
    // TODO: check is this user has access to update this
    const updatedPost = await this.postService.update(id, dto, image);
    if (!updatedPost) {
      throw new HttpException('Not found post.', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  async getByPostId(@Param('id') id: string) {
    const post = await this.postService.findById(id);
    if (!post) {
      throw new HttpException('Not found post.', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  @Get('get-all')
  async getAllPosts() {
    return await this.postService.findAll();
  }

  @Get('get-last')
  async getLastPosts(
    @Query('limit') limit: number,
    @Query('skip') skip?: number,
  ) {
    return await this.postService.findLast(limit, skip);
  }
}
