import { BaseModel } from './common/base-model';
import * as yup from 'yup';
import { RelationMappings, Model, ToJsonOptions, ModelObject } from 'objection';
import { SystemRoleModel } from './system-role.model';
import { UniqueID } from '@/shared/types';

export class UserModel extends BaseModel {
  static tableName = 'users';

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
    id: yup.string().required(),

    firstName: yup.string().min(2).trim().required(),

    middleName: yup.string().nullable(),

    lastName: yup.string().min(2).required(),

    email: yup.string().email().required(),

    password: yup.string().min(8).required(),
  };

  toJSON(opt?: ToJsonOptions): ModelObject<this> {
    // Type assertion to "any" here due to: https://github.com/Vincit/objection.js/issues/1861
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = super.toJSON(opt) as any;

    delete result.hash;

    return result;
  }

  id!: UniqueID;
  firstName!: string;
  middleName!: string | null;
  lastName!: string;
  email!: string;
  hash!: string;
  createdAt!: Date;
  updatedAt!: Date;

  roles?: SystemRoleModel[];
}
