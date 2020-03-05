import { IDefaultJwtPayload } from './IJwtPayload';

export interface IAccessTokenPayload extends IDefaultJwtPayload {
  userId: string;
}
