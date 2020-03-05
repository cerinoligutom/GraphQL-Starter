import { BaseModel } from './common/BaseModel';
import * as yup from 'yup';

export class User extends BaseModel {
  static tableName = 'users';

  static yupSchema = {
    firstName: yup
      .string()
      .min(2)
      .trim()
      .required(),

    middleName: yup.string().nullable(),

    lastName: yup
      .string()
      .min(2)
      .required(),

    username: yup
      .string()
      .min(4)
      .max(32)
      .required(),

    email: yup
      .string()
      .email()
      .required(),
  };

  id!: string;
  username!: string;
  firstName!: string;
  middleName?: string | null;
  lastName!: string;
  email!: string;
  hash!: string;
  salt!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
