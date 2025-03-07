import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtendedRequest } from 'src/auth/interface/request.interface';

export const UserFromDb = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req: ExtendedRequest = ctx.switchToHttp().getRequest();
    const user = req.user;
    return data ? (user as any)?.[data] : user;
  },
);
