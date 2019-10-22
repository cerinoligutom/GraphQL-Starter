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
      .required()
      .test({
        message: 'Username already exists.',
        test: async (value: string) => {
          const user = await User.query().findOne({
            username: value,
          });

          return !user;
        },
      }),

    email: yup
      .string()
      .email()
      .required()
      .test({
        message: 'Email already exists.',
        test: async (value: string) => {
          const user = await User.query().findOne({
            email: value,
          });

          return !user;
        },
      }),
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
