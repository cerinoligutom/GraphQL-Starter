import { IAccessTokenPayload } from '@/shared/interfaces';
import { tokenGenerator } from '@/utils';

export function verifyAccessToken(token: string): IAccessTokenPayload | null {
  return tokenGenerator.verify(token);
}
