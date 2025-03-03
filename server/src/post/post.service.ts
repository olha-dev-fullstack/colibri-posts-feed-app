import { Inject, Injectable } from '@nestjs/common';
import { CollectionReference, Firestore } from 'firebase-admin/firestore';
import { FirestoreDatabaseProvider } from 'src/firestore/firestore.providers';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostDocument } from './post.document';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostDocument.collectionName)
    private postsCollection: CollectionReference<PostDocument>,
    @Inject(FirestoreDatabaseProvider)
    private firestore: Firestore,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostDocument> {
    const newPost: PostDocument = {
      ...createPostDto,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    };
    const docRef = await this.postsCollection.add(newPost);
    return { id: docRef.id, ...newPost };
  }

  async getPosts(): Promise<PostDocument[]> {
    const snapshot = await this.postsCollection.get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as PostDocument,
    );
  }

  async getPostById(id: string): Promise<PostDocument | null> {
    const doc = await this.postsCollection.doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as PostDocument) : null;
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<void> {
    await this.postsCollection.doc(id).update({
      ...updatePostDto,
      updatedAt: new Date() as any,
    });
  }

  async deletePost(id: string): Promise<void> {
    await this.postsCollection.doc(id).delete();
  }

  async likePost(postId: string, userId: string): Promise<void> {
    const postRef = this.postsCollection.doc(postId);
    await this.firestore.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists) throw new Error('Post not found');

      const post = postDoc.data();
      const likesCopy = new Set(post.likes || []);
      const dislikesCopy = new Set(post.dislikes || []);

      if (likesCopy.has(userId)) return;

      likesCopy.add(userId);

      dislikesCopy.delete(userId);

      transaction.update(postRef, {
        likes: Array.from(likesCopy),
        likesCount: likesCopy.size,
        dislikes: Array.from(dislikesCopy),
        dislikesCount: dislikesCopy.size,
      });
    });
  }

  async dislikePost(postId: string, userId: string): Promise<void> {
    const postRef = this.postsCollection.doc(postId);
    await this.firestore.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists) throw new Error('Post not found');

      const post = postDoc.data();
      const likesCopy = new Set(post.likes || []);
      const dislikesCopy = new Set(post.dislikes || []);

      if (dislikesCopy.has(userId)) return;

      dislikesCopy.add(userId);
      likesCopy.delete(userId);

      transaction.update(postRef, {
        likes: Array.from(likesCopy),
        likesCount: likesCopy.size,
        dislikes: Array.from(dislikesCopy),
        dislikesCount: dislikesCopy.size,
      });
    });
  }
}
