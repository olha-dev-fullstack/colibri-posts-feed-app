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
  owner: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
