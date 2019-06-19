import { UserInputError } from 'apollo-server-core';
import * as yup from 'yup';
import { rule } from 'graphql-shield';

// tslint:disable-next-line: no-any
export const yupRule = (schema: yup.Schema<any>) =>
  rule()(async (parent, args) => {
    try {
      await schema.validate(args, { abortEarly: false });
      return true;
    } catch (err) {
      return new UserInputError('Invalid form', err);
    }
  });
