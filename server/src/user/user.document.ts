export class UserDocument {
  static collectionName = 'users';

  id?: string;
  firebaseId: string;
  username: string;
  email: string;
  profileImage?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
