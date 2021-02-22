import { verifyAccessToken } from '@/modules/auth/helpers/verify-access-token';
import { Request } from 'express';
import { IAccessTokenPayload } from '../interfaces';

export function processAccessTokenFromAuthHeader(req: Request): IAccessTokenPayload | null {
  // Optional chain here because it can be null for GraphQL Subscriptions.
  // GraphQL uses the websocket protocol so there's no request/response object
  // present there.
  const authorizationHeader = req?.headers?.authorization;

  if (!authorizationHeader) {
    return null;
  }

  const [, token] = authorizationHeader.split(' ');
  const payload = verifyAccessToken(token);
  return payload;
}
