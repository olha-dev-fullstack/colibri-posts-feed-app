import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtendedRequest } from 'src/auth/interface/request.interface';
export const UserFromToken = createParamDecorator(
  (data: void, ctx: ExecutionContext) => {
    const req: ExtendedRequest = ctx.switchToHttp().getRequest();
    const decodedUser = req.firebasePayload;
    return decodedUser;
  },
);
