import { BadInputError } from '@/errors';
import * as yup from 'yup';

/**
 * Helper assertion function
 *
 * See [docs](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) if unfamiliar
 */
function assertIsYupValidationError(err: any): asserts err is yup.ValidationError {
  if (!(err instanceof yup.ValidationError)) {
    throw err;
  }
}

export const createSchemaValidator = <T extends Record<string, any>>(schema: yup.AnySchema) => async (data: T): Promise<T> => {
  try {
    return await schema.validate(data, { abortEarly: false });
  } catch (err) {
    assertIsYupValidationError(err);

    const formattedInput = err.inner.reduce<Record<string, string[]>>((accumulator, currentError) => {
      const key = currentError.path! as keyof typeof accumulator;

      if (accumulator[key]) {
        accumulator[key].push(currentError.message);
      } else {
        accumulator[key] = [currentError.message];
      }

      return accumulator;
    }, {});

    throw new BadInputError(formattedInput);
  }
};
