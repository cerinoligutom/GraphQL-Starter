import { GQL_User } from '@/generated/graphql/index.js';
import { ResponseUserFull, ResponseUserSimple } from '../responses/user.response.js';
import { Selectable } from 'kysely';
import { User } from '@/db/types.js';

// We need this factory function mainly for type safety and assuring
// that if there are any graphql schema changes, we only need to modify
// the respective factory function and the resolvers using these factory
// functions won't break because of the explicit return type that is set.

// IMPORTANT:
// Make sure to set the return type of the factory functions!

function createGQLUser(user: Selectable<User>): GQL_User {
  return {
    id: user.id,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,

    /**
     * Fields that have their own field resolvers should be set to `null`
     * and asserted as type `any` on this level. It should also be separated
     * pretty much like how eager loaded fields are separated in our objection models.
     */

    fullName: null as any,
  };
}

function toFullResponse(user: Selectable<User>): ResponseUserFull {
  return {
    id: user.id,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

function toSimpleResponse(user: Selectable<User>): ResponseUserSimple {
  return {
    id: user.id,
  };
}

export const userFactory = {
  createGQLUser,
  toFullResponse,
  toSimpleResponse,
};
