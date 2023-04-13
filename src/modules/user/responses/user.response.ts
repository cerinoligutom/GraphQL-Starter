import { UUIDv4 } from '@/shared/types';

export type ResponseUserFull = {
  id: UUIDv4;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type ResponseUserSimple = {
  id: UUIDv4;
};
