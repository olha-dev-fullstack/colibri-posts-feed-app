export class PostDocument {
  static collectionName = 'posts';

  id?: string;
  title: string;
  text: string;
  photo?: string;
  likes: number;
  dislikes: number;
  owner: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
