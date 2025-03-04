import { PostDocument } from 'src/post/post.document';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  PostDocument.collectionName,
];
