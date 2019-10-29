import { UserInputError } from 'apollo-server-core';
import * as yup from 'yup';
import { rule } from 'graphql-shield';
import * as _ from 'lodash';

// tslint:disable-next-line: no-any
export const yupRule = (schema: yup.Schema<any>) =>
  rule()(async (parent, args) => {
    try {
      const validatedArgs = await schema.validate(args, { abortEarly: false });

      // Merge validatedArgs to args
      _.assign(args, validatedArgs);

      return true;
    } catch (err) {
      return new UserInputError('Invalid form', err);
    }
  });
