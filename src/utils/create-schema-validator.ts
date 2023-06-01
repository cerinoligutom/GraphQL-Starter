/* eslint-disable @typescript-eslint/no-explicit-any */

import { BadInputError } from '@/errors/bad-input.error.js';
import { ZodError, ZodSchema } from 'zod';

function assertIsZodError<T = any>(err: any): asserts err is ZodError<T> {
  if (!(err instanceof ZodError)) {
    throw err;
  }
}

export const createSchemaValidator =
  (schema: ZodSchema) =>
  async <T extends Record<string, any>>(data: T): Promise<T> => {
    try {
      return schema.parse(data);
    } catch (err) {
      assertIsZodError(err);

      throw new BadInputError(err.flatten().fieldErrors);
    }
  };
