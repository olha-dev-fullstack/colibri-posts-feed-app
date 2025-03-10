export class PostDocument {
  static collectionName = 'posts';

  id?: string;
  title: string;
  text: string;
  photo?: string;
  likes: string[];
  dislikes: string[];
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  owner: string;
  createdAt: FirebaseFirestore.Timestamp | Date;
  updatedAt: FirebaseFirestore.Timestamp;
}
