import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type SystemRole = {
  id: string;
  name: string;
  description: string | null;
};
export type User = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  hashedPassword: string;
  createdAt: Generated<Timestamp>;
  /**
   * We're using Kysely instead of Prisma Client so we have a responsibility to always update this value when the record is inserted/updated.
   */
  updatedAt: Timestamp;
};
export type UserSystemRoles = {
  userId: string;
  systemRoleId: string;
};
export type DB = {
  system_roles: SystemRole;
  user_system_roles: UserSystemRoles;
  users: User;
};
