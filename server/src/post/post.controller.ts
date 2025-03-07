import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserFromDb } from 'src/decorators/userFromDb.decorator';
import { UserDocument } from 'src/user/user.document';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @UserFromDb() userInfo: UserDocument,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(userInfo, createPostDto);
  }

  @Get()
  getFeed(@UserFromDb('firebaseId') userId: string) {
    return this.postsService.getFeed(userId);
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
