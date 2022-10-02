import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = getTokenFromHeaders(request);
    if (accessToken) {
      return !!this.jwtService.verify(accessToken, {
        ignoreExpiration: false,
        secret: process.env.JWT_SECRET ?? 'secret',
      });
    }
    return false;
  }
}

function getTokenFromHeaders(req: Request): string | null {
  const authorization = req.headers.authorization;
  if (authorization) {
    return authorization.replace('Bearer ', '');
  }
  return null;
}
