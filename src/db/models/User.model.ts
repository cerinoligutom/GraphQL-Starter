import { BaseModel } from './common/BaseModel';
import * as yup from 'yup';
import { RelationMappings, Model } from 'objection';
import { SystemRole } from './system-role.model';

export class User extends BaseModel {
  static tableName = 'users';
  static readonly modelName = 'User';

  static relationMappings: RelationMappings = {
    roles: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/SystemRole.model`,
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

  roles?: SystemRole[];
}
