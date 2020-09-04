import * as yup from 'yup';

export const loginSchema = yup.object({
  input: yup.object({
    usernameOrEmail: yup.string().required(),
    password: yup.string().min(8).max(32),
  }),
});
