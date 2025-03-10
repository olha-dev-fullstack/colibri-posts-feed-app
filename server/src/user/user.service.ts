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

  async getUserPosts(userId: string): Promise<PostDocument[]> {
    const snapshot = await this.postsCollection
      .where('owner', '==', userId)
      .get();
    const posts = snapshot.docs.map((p) => ({
      id: p.id,
      ...p.data(),
      createdAt: p.createTime.toDate(),
    }));
    return posts;
  }
}
