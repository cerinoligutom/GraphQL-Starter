import { UserModel } from '@/db/models';
import { GQL_User } from '@/generated/graphql';

// NOTE:
// We need this factory function mainly for type safety and assuring
// that if there are any graphql schema changes, we only need to modify
// the respective factory function and the resolvers using these factory
// functions won't break because of the explicit return type that is set.

// IMPORTANT:
// Make sure to set the return type of the factory functions!

export function createGQL_User(user: UserModel): GQL_User {
  return {
    ...user,

    id: user.id,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,

    /**
     * NOTE: Fields that have their own field resolvers should be set to `null`
     * and asserted as type `any` on this level. It should also be separated
     * pretty much like how eager loaded fields are separated in our objection models.
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fullName: null as any,
  };
}
