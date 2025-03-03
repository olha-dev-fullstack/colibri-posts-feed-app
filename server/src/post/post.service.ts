import { Inject, Injectable } from '@nestjs/common';
import { CollectionReference } from 'firebase-admin/firestore';
import { CreatePostDto } from './dto/post.dto';
import { PostDocument } from './post.document';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostDocument.collectionName)
    private postsCollection: CollectionReference<PostDocument>,
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
}
