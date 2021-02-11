import { BaseModel } from './common/base-model';
import * as yup from 'yup';
import { RelationMappings, Model } from 'objection';
import { SystemRoleModel } from './system-role.model';

export class UserModel extends BaseModel {
  static tableName = 'users';
  static readonly modelName = 'User';

  static relationMappings: RelationMappings = {
    roles: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/system-role.model`,
      join: {
        from: 'users.id',
        through: {
          from: 'user_system_roles.userId',
          to: 'user_system_roles.roleId',
        },
        to: 'system_roles.id',
      },
    },
  };

  static yupSchema = {
    firstName: yup.string().min(2).trim().required(),

    middleName: yup.string().nullable(),

    lastName: yup.string().min(2).required(),

    username: yup.string().min(4).max(32).required(),

    email: yup.string().email().required(),
  };

  id!: string;
  username!: string;
  firstName!: string;
  middleName!: string | null;
  lastName!: string;
  email!: string;
  hash!: string;
  salt!: string;
  createdAt!: Date;
  updatedAt!: Date;

  roles?: SystemRoleModel[];
}

// We extend the global Express User interface with our User model
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserModel {}
  }
}
