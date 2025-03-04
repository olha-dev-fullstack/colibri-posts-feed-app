import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/comment.dto';

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.addComment(postId, createCommentDto);
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
