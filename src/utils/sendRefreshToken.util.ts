import { Response } from 'express';
import { decode } from 'jsonwebtoken';
import { IRefreshTokenPayload } from '@app/core/interfaces';

export const sendRefreshToken = (res: Response, token: string) => {
  const payload = decode(token) as IRefreshTokenPayload | null;

  // Match the cookie's expiry with the token's expiry
  const expires = payload?.exp ? new Date(payload.exp * 1000) : undefined;

  res.cookie('jid', token, {
    expires,
    httpOnly: true,

    // Note:
    // Make sure to match "path" with the refresh token route on the server
    // so that this cookie only gets sent when hitting the route value
    // specified in the "path".
    path: '/refreshToken',
  });
};
