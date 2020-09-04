import * as yup from 'yup';
import { UserModel } from '@app/db/models';

const { firstName, middleName, lastName, username, email } = UserModel.yupSchema;

export const registerSchema = yup.object({
  input: yup.object({
    firstName,
    middleName,
    lastName,
    username,
    email,
    password: yup.string().required().min(8).max(64),
  }),
});
