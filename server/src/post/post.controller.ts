import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.getPosts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }

  @Post(':id/like')
  likePost(@Param('id') postId: string, @Body('userId') userId: string) {
    return this.postsService.likePost(postId, userId);
  }

  @Post(':id/dislike')
  dislikePost(@Param('id') postId: string, @Body('userId') userId: string) {
    return this.postsService.dislikePost(postId, userId);
  }
}
