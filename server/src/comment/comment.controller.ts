import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/comment.dto';
import { UserFromDb } from 'src/decorators/userFromDb.decorator';
import { UserDocument } from 'src/user/user.document';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Param('postId') postId: string,
    @UserFromDb() user: UserDocument,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.addComment(postId, user, createCommentDto);
  }

  //   @Post('reply')
  //   addReply(@Body() createReplyDto: CreateReplyDto) {
  //     return this.commentsService.addReply(createReplyDto);
  //   }

  @Get()
  findAll(@Param('postId') postId: string) {
    return this.commentService.getCommentsByPost(postId);
  }

  //   @Get(':postId/:commentId/replies')
  //   getReplies(
  //     @Param('postId') postId: string,
  //     @Param('commentId') commentId: string,
  //   ) {
  //     return this.commentsService.getRepliesByComment(postId, commentId);
  //   }
}
