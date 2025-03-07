import { Inject, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { CollectionReference } from 'firebase-admin/firestore';

import { Auth } from 'firebase-admin/auth';
import { FirebaseAppService } from 'src/firebase/firebaseApp.service';
import { UserDocument } from 'src/user/user.document';
import { ExtendedRequest } from '../interface/request.interface';

export class AuthMiddleware implements NestMiddleware {
  private auth: Auth;
  constructor(
    @Inject(UserDocument.collectionName)
    private userCollection: CollectionReference<UserDocument>,
    private firebaseService: FirebaseAppService,
  ) {
    this.auth = this.firebaseService.getAuth();
  }

  use(req: ExtendedRequest, res: Response, next: () => void) {
    const token = req.headers.authorization;

    if (token != null && token != '') {
      this.auth
        .verifyIdToken(token.split(' ')[1])
        .then(async (decodedToken) => {
          const firebaseId = decodedToken.uid;

          const userFromDb = (
            await this.userCollection.doc(firebaseId).get()
          ).data();
          req.user = userFromDb;
          req.firebasePayload = decodedToken;
          next();
        })
        .catch(() => {
          next();
        });
    } else {
      next();
    }
  }
}
