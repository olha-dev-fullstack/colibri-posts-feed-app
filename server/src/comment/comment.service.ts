import { Inject, Injectable } from '@nestjs/common';
import { CollectionReference } from 'firebase-admin/firestore';
import { PostDocument } from 'src/post/post.document';
import { UserDocument } from 'src/user/user.document';
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
    user: UserDocument,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentDocument> {
    const { text } = createCommentDto;
    const { firebaseId: userId, username } = user;
    const postRef = this.postsCollection.doc(postId);
    const commentsCount = (await postRef.get()).data().commentsCount || 0;
    console.log(commentsCount);
    const commentRef = postRef.collection(CommentDocument.collectionName).doc();

    const newComment: CommentDocument = {
      text,
      userId,
      username,
      postId,
      createdAt: new Date() as any,
    };

    await commentRef.set(newComment);
    await postRef.set({ commentsCount: commentsCount + 1 }, { merge: true });

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
