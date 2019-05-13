import { User } from '@app/db/models';

const getById = async (id: string) => {
  return User.query().findById(id);
};

export const userService = {
  getById,
};
