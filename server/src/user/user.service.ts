import { Inject, Injectable } from '@nestjs/common';
import { CollectionReference } from 'firebase-admin/firestore';
import { CreateUserDto } from './dto/user.dto';
import { UserDocument } from './user.document';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserDocument.collectionName)
    private userCollection: CollectionReference<UserDocument>,
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
}
