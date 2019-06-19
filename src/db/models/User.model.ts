import { BaseModel } from './common/BaseModel';
import { TableNames } from '../table-names';

export class User extends BaseModel {
  static tableName = TableNames.Users;

  username!: string;
  firstName!: string;
  middleName?: string | null;
  lastName!: string;
  email!: string;
  hash!: string;
  salt!: string;
}
