import { BaseModel } from './common/BaseModel';
import * as yup from 'yup';
import { RelationMappings, Model } from 'objection';
import { User } from './user.model';

export class SystemRole extends BaseModel {
  static tableName = 'system_roles';

  static relationMappings: RelationMappings = {
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/User.model`,
      join: {
        from: 'system_roles.id',
        through: {
          from: 'user_system_roles.roleId',
          to: 'user_system_roles.userId',
        },
        to: 'users.id',
      },
    },
  };

  static yupSchema = {
    name: yup.string().required(),

    description: yup.string().required(),
  };

  id!: string;
  name!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;

  users?: User[];
}
