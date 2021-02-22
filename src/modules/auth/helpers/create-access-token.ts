import { IAccessTokenPayload } from '@/shared/interfaces';
import { tokenGenerator } from '@/utils';

export function createAccessToken(payload: IAccessTokenPayload): string {
  return tokenGenerator.sign(payload, { subject: payload.userId.toString() });
}
