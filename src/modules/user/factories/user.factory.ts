import { UserModel } from '@/db/models';
import { GQL_User } from '@/generated/graphql';
import { IResponseUserFull, IResponseUserSimple } from '../responses/user.response';

// We need this factory function mainly for type safety and assuring
// that if there are any graphql schema changes, we only need to modify
// the respective factory function and the resolvers using these factory
// functions won't break because of the explicit return type that is set.

// IMPORTANT:
// Make sure to set the return type of the factory functions!

function createGQLUser(user: UserModel): GQL_User {
  const userJson = user.toJSON();
  return {
    ...userJson,

    id: userJson.id,
    firstName: userJson.firstName,
    middleName: userJson.middleName,
    lastName: userJson.lastName,
    email: userJson.email,
    createdAt: userJson.createdAt,
    updatedAt: userJson.updatedAt,

    /**
     * Fields that have their own field resolvers should be set to `null`
     * and asserted as type `any` on this level. It should also be separated
     * pretty much like how eager loaded fields are separated in our objection models.
     */

    fullName: null as any,
  };
}

function toFullResponse(user: UserModel): IResponseUserFull {
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

function toSimpleResponse(user: UserModel): IResponseUserSimple {
  return {
    id: user.id,
  };
}

export const userFactory = {
  createGQLUser,
  toFullResponse,
  toSimpleResponse,
};
