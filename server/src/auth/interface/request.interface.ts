import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { UserDocument } from 'src/user/user.document';

export interface ExtendedRequest extends Request {
  user: UserDocument | null;
  firebasePayload: DecodedIdToken;
}
