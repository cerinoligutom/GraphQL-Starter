import * as yup from 'yup';
import { User } from '@app/db/models';

export const registerSchema = yup.object({
  input: yup.object({
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

    password: yup
      .string()
      .required()
      .min(8)
      .max(64),
  }),
});
