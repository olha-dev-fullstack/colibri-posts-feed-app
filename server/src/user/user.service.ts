import { Inject, Injectable } from '@nestjs/common';
import { CollectionReference } from 'firebase-admin/firestore';
import { PostDocument } from 'src/post/post.document';
import { CreateUserDto } from './dto/user.dto';
import { UserDocument } from './user.document';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserDocument.collectionName)
    private userCollection: CollectionReference<UserDocument>,
    @Inject(PostDocument.collectionName)
    private postsCollection: CollectionReference<PostDocument>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<UserDocument> {
    const newUser: UserDocument = {
      ...userData,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    };

    await this.userCollection.doc(userData.firebaseId).set(newUser);
    return (await this.userCollection.doc(userData.firebaseId).get()).data();
  }

  async getUserPosts(
    userId: string,
    limit: number,
    lastDocId?: string,
    query?: string,
  ): Promise<{ posts: PostDocument[]; lastVisibleId: string }> {
    let postsQuery = this.postsCollection
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .where('owner', '==', userId);

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

    const posts = snapshot.docs.map((p) => ({
      id: p.id,
      ...p.data(),
      createdAt: p.createTime.toDate(),
    }));

    const lastVisibleId = posts[posts.length - 1]?.id;

    return { posts, lastVisibleId };
  }
}
