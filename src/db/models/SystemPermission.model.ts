import { BaseModel } from './common/BaseModel';
import * as yup from 'yup';
import { RelationMappings, Model } from 'objection';
import { SystemRole } from './SystemRole.model';

export class SystemPermission extends BaseModel {
  static tableName = 'system_permissions';

  // https://vincit.github.io/objection.js/api/model/static-properties.html#static-jsonattributes
  static get jsonAttributes() {
    return ['conditions'];
  }

  static relationMappings: RelationMappings = {
    roles: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/SystemRole.model`,
      join: {
        from: 'system_permissions.id',
        through: {
          from: 'system_role_permissions.permissionId',
          to: 'system_role_permissions.roleId',
        },
        to: 'system_roles.id',
      },
    },
  };

  static yupSchema = {
    action: yup.string().required(),

    subject: yup.string().required(),

    conditions: yup.object().nullable(),

    description: yup.string().required(),
  };

  id!: string;
  action!: string;
  subject!: string;
  conditions?: Record<string, string>;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;

  roles?: SystemRole[];
}
