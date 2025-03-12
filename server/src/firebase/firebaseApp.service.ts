import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';

@Injectable()
export class FirebaseAppService {
  private firebaseApp: firebase.app.App;

  constructor(private configService: ConfigService) {
    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp({
        credential: firebase.credential.cert(
          configService.get<string>('SA_KEY'),
        ),
      });
    } else {
      this.firebaseApp = firebase.app();
    }
  }

  getAuth = (): firebase.auth.Auth => {
    return this.firebaseApp.auth();
  };
}
