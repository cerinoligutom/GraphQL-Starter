import { IDefaultJwtPayload } from './IJwtPayload';

export interface IRefreshTokenPayload extends IDefaultJwtPayload {
  userId: string;
}
