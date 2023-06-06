import { GQL_User } from '@/generated/graphql/index.js';
import { ResponseUserFull, ResponseUserFullSchema, ResponseUserSimple, ResponseUserSimpleSchema } from '../responses/user.response.js';
import { Selectable } from 'kysely';
import { User } from '@/db/types.js';

// We need this factory function mainly for type safety and assuring
// that if there are any graphql schema changes, we only need to modify
// the respective factory function and the resolvers using these factory
// functions won't break because of the explicit return type that is set.

// IMPORTANT:
// Make sure to set the return type of the factory functions!

function createGQLUser(user: Selectable<User>): GQL_User {
  /**
   * Using Zod Schemas to validate GQL responses, I think, is up to you or your team.
   * The GraphQL Scalar types usually handles this for us so depending on your
   * preference, you can either use Zod Schemas or not.
   *
   * Take for example, the `Int` Scalar only accepts integer values but does not
   * restrict values to be within a certain range.
   * Some teams prefer making use of GraphQL Directives (https://www.apollographql.com/docs/apollo-server/schema/directives/)
   * to achieve this, some prefer doing it on this level using whatever schema validation
   * tool the team prefers (for this boilerplate, it's Zod.).
   */

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
  return ResponseUserFullSchema.parse(user);
}

function toSimpleResponse(user: Selectable<User>): ResponseUserSimple {
  return ResponseUserSimpleSchema.parse(user);
}

export const userFactory = {
  createGQLUser,
  toFullResponse,
  toSimpleResponse,
};
