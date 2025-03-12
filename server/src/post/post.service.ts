import { Inject, Injectable } from '@nestjs/common';
import {
  CollectionReference,
  Firestore,
  Query,
} from 'firebase-admin/firestore';
import { FirestoreDatabaseProvider } from 'src/firestore/firestore.providers';
import { UserDocument } from 'src/user/user.document';
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

  async createPost(
    userInfo: UserDocument,
    createPostDto: CreatePostDto,
  ): Promise<PostDocument> {
    const newPost: PostDocument = {
      ...createPostDto,
      likes: [],
      dislikes: [],
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
      owner: userInfo.firebaseId,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    };

    const docRef = await this.postsCollection.add(newPost);
    return { id: docRef.id, ...newPost };
  }

  async getFeed(userId?: string): Promise<PostDocument[]> {
    let query: Query;
    if (userId) {
      query = this.postsCollection.where('owner', '!=', userId);
    } else {
      query = this.postsCollection;
    }
    const snapshot = await query.get();
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.createTime.toDate(),
        }) as PostDocument,
    );
  }

  async getPaginatedFeed(
    limit?: number,
    userId?: string,
    lastDocId?: string,
    query?: string,
  ): Promise<{ posts: PostDocument[]; lastVisibleId: string }> {
    let postsQuery = this.postsCollection
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (userId) {
      postsQuery = postsQuery.where('owner', '!=', userId);
    }
    if (query) {
      const endQuery = query + '\uf8ff';
      postsQuery = postsQuery
        .where('title', '>=', query)
        .where('title', '<=', endQuery);
    }
    if (lastDocId) {
      const lastDoc = await this.postsCollection.doc(lastDocId).get();
      postsQuery = postsQuery.startAfter(lastDoc);
    }

    const snapshot = await postsQuery.get();
    const posts = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.createTime.toDate(),
        }) as PostDocument,
    );

    const lastVisibleId = posts[posts.length - 1]?.id;
    return { posts, lastVisibleId };
  }

  async getPostById(id: string): Promise<PostDocument | null> {
    const doc = await this.postsCollection.doc(id).get();
    return doc.exists
      ? ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.createTime.toDate(),
        } as PostDocument)
      : null;
  }

  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostDocument> {
    await this.postsCollection.doc(id).update({
      ...updatePostDto,
      updatedAt: new Date() as any,
    });
    return this.getPostById(id);
  }

  async deletePost(id: string): Promise<void> {
    await this.postsCollection.doc(id).delete();
  }

  async likePost(postId: string, userId: string): Promise<PostDocument> {
    const postRef = this.postsCollection.doc(postId);
    await this.firestore.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists) throw new Error('Post not found');

      const post = postDoc.data();
      const likesCopy = new Set(post.likes || []);
      const dislikesCopy = new Set(post.dislikes || []);

      if (likesCopy.has(userId)) {
        likesCopy.delete(userId);
      } else {
        likesCopy.add(userId);
        dislikesCopy.delete(userId);
      }

      transaction.update(postRef, {
        likes: Array.from(likesCopy),
        likesCount: likesCopy.size,
        dislikes: Array.from(dislikesCopy),
        dislikesCount: dislikesCopy.size,
      });
    });

    return this.getPostById(postId);
  }

  async dislikePost(postId: string, userId: string): Promise<PostDocument> {
    const postRef = this.postsCollection.doc(postId);
    await this.firestore.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists) throw new Error('Post not found');

      const post = postDoc.data();
      const likesCopy = new Set(post.likes || []);
      const dislikesCopy = new Set(post.dislikes || []);

      if (dislikesCopy.has(userId)) {
        dislikesCopy.delete(userId);
      } else {
        dislikesCopy.add(userId);
        likesCopy.delete(userId);
      }

      transaction.update(postRef, {
        likes: Array.from(likesCopy),
        likesCount: likesCopy.size,
        dislikes: Array.from(dislikesCopy),
        dislikesCount: dislikesCopy.size,
      });
    });
    return this.getPostById(postId);
  }
}
