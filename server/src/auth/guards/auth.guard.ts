import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExtendedRequest } from '../interface/request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: ExtendedRequest = context.switchToHttp().getRequest();
    if (!request.user) {
      return false;
    }
    return true;
  }
}
