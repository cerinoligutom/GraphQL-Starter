import { UniqueID } from '@/shared/types';

export interface IResponseUserFull {
  id: UniqueID;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IResponseUserSimple {
  id: UniqueID;
}
