import { Inject, Injectable } from '@nestjs/common';
import { CollectionReference } from 'firebase-admin/firestore';
import { PostDocument } from 'src/post/post.document';
import { CommentDocument } from './comment.document';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @Inject(PostDocument.collectionName)
    private postsCollection: CollectionReference<PostDocument>,
  ) {}
  async addComment(
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentDocument> {
    const { userId, username, ...commentData } = createCommentDto;
    const commentRef = this.postsCollection
      .doc(postId)
      .collection(CommentDocument.collectionName)
      .doc();

    const newComment: CommentDocument = {
      ...commentData,
      userId,
      username,
      postId,
      createdAt: new Date() as any,
    };

    await commentRef.set(newComment);
    return { id: commentRef.id, ...newComment };
  }

  async getCommentsByPost(postId: string): Promise<CommentDocument[]> {
    const snapshot = await this.postsCollection
      .doc(postId)
      .collection(CommentDocument.collectionName)
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as CommentDocument,
    );
  }
}
