import { Express, Request, Response } from 'express';
import { IRefreshTokenPayload } from '@app/core/interfaces';
import { authService } from '@app/core/services';
import { User } from '@app/db/models';
import { sendRefreshToken } from '@app/utils';
import cookieParser from 'cookie-parser';

export const initRefreshTokenRoute = (app: Express) => {
  app.post('/refreshToken', cookieParser(), refreshTokenRoute);
};

async function refreshTokenRoute(req: Request, res: Response) {
  const token = req.cookies.jid;
  if (!token) {
    return sendFailResponse(res);
  }

  let payload: IRefreshTokenPayload | null = null;
  try {
    payload = authService.validateRefreshToken(token);
  } catch (err) {
    return sendFailResponse(res);
  }

  // Token is valid at this point and we can probably send back an access token.
  // Your custom logic for handling tokens goes here.

  if (!payload?.userId) {
    return sendFailResponse(res);
  }

  const user = await User.query().findById(payload.userId);
  if (!user) {
    return sendFailResponse(res);
  }

  // Note:
  // You might want to implement a mechanism to invalidate
  // the tokens. There are many ways to go about this such as
  // whitelisting/blacklisting tokens or versioning tokens (simple).

  const accessToken = authService.createAccessToken(user);

  // Note:
  // You might want to put some logic on how often the refresh token
  // gets updated like for example, only update the refresh token
  // if there's less than 1 day left before the token expires.
  sendRefreshToken(res, authService.createRefreshToken(user));

  return res.send({ accessToken, ok: true });
}

function sendFailResponse(res: Response) {
  res.send({ ok: false, accessToken: '' });
}
