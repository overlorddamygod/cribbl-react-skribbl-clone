
import { Injectable, CanActivate, ExecutionContext, createParamDecorator } from '@nestjs/common';
import {verify } from "jsonwebtoken"

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
        verify(request.headers.authorization, process.env.TOKEN_SECRET);
        return true
    } catch(err) {
        return false;
    }
  }
}

export const Authorization = createParamDecorator((_, request: any) => {
    const { authorization: accessToken } = request.headers;
    try {
      const decoded = verify(accessToken, process.env.TOKEN_SECRET);
      return decoded;
    } catch (ex) {
      throw new Error("unauthorized");
    }
  });
