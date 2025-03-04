export class CommentDocument {
  static collectionName = 'comments';

  id?: string;
  postId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: FirebaseFirestore.Timestamp;
}
