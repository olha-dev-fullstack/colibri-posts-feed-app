import { PostDocument } from 'src/post/post.document';
import { UserDocument } from 'src/user/user.document';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  PostDocument.collectionName,
  UserDocument.collectionName,
];
