import {
  Controller,
  Get,
  NotFoundException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { UserFromDb } from 'src/decorators/userFromDb.decorator';
import { UserFromToken } from 'src/decorators/userFromToken.decorator';
import { FirebaseAppService } from 'src/firebase/firebaseApp.service';
import { UserDocument } from './user.document';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private firebaseAppService: FirebaseAppService,
    private userService: UserService,
  ) {}

  @Get()
  async findOrCreateUser(
    @UserFromToken() decodedUser: DecodedIdToken,
    @UserFromDb() userFromDb: UserDocument,
  ) {
    if (!decodedUser) {
      throw new NotFoundException('User not found');
    }
    if (userFromDb) {
      return userFromDb;
    }
    const userFromFirebaseAuth = await this.firebaseAppService
      .getAuth()
      .getUser(decodedUser.uid);

    return this.userService.createUser({
      email: userFromFirebaseAuth.email,
      username: userFromFirebaseAuth.displayName,
      firebaseId: decodedUser.uid,
    });
  }

  @Get('/posts')
  async getUserPosts(
    @UserFromDb('firebaseId') userId: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('lastDocId') lastDocId?: string,
    @Query('query') query?: string,
  ) {
    return this.userService.getUserPosts(userId, limit, lastDocId, query);
  }
}
