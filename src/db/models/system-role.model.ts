import { BaseModel } from './common/base-model';
import * as yup from 'yup';
import { RelationMappings, Model, QueryContext, ModelOptions } from 'objection';
import { UserModel } from './user.model';

export class SystemRoleModel extends BaseModel {
  static tableName = 'system_roles';

  static relationMappings: RelationMappings = {
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/user.model`,
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

  $beforeInsert(queryContext: QueryContext): void {
    super.$beforeInsert(queryContext);

    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }
  $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void {
    super.$beforeUpdate(opt, queryContext);

    this.updatedAt = new Date();
  }

  name!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;

  users?: UserModel[];
}
