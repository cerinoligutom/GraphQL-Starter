import { BaseModel } from './common/BaseModel';

export class User extends BaseModel {
  static tableName = 'users';

  id!: string;
  username!: string;
  firstName!: string;
  middleName?: string | null;
  lastName!: string;
  email!: string;
  hash!: string;
  salt!: string;
  createdAt!: string;
  updatedAt!: string;
}
