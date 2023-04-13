/**
 * There are multiple ways to revoke sessions with SuperTokens. Read more from the link below:
 * https://supertokens.io/docs/session/common-customizations/sessions/revoke-session
 */

import { RequestHandler } from 'express';

type ResponseBody = {
  message: string;
};
export const logoutHandler: RequestHandler<any, ResponseBody, any, any> = async (req, res) => {
  await req.session?.revokeSession();

  res.send({
    message: 'OK',
  });
};
