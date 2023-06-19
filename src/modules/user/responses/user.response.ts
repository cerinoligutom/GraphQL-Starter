import { z } from 'zod';
import { UserSchema } from '@/db/schema/index.js';

export const ResponseUserFullSchema = z
  .object({
    id: UserSchema.shape.id,
    firstName: UserSchema.shape.firstName,
    middleName: UserSchema.shape.middleName,
    lastName: UserSchema.shape.lastName,
    email: UserSchema.shape.email,
    createdAt: UserSchema.shape.createdAt,
    updatedAt: UserSchema.shape.updatedAt,
  })
  .extend({
    // We need the date objects to be serialized but in valid datetime format.
    createdAt: z.coerce.date().transform((arg) => arg.toISOString()),
    updatedAt: z.coerce.date().transform((arg) => arg.toISOString()),
  });
export type ResponseUserFull = z.infer<typeof ResponseUserFullSchema>;

export const ResponseUserSimpleSchema = z.object({
  id: UserSchema.shape.id,
});
export type ResponseUserSimple = {
  id: string;
};
