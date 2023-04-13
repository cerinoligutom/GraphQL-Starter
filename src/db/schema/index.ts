import { z } from 'zod';

const createdAt = z.string().datetime();
const updatedAt = z.string().datetime();

export const UserSchema = z
  .object({
    id: z.string().uuid(),
    firstName: z.string(),
    middleName: z.string().nullable().optional(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
  })
  .merge(z.object({ createdAt, updatedAt }));

export const SystemRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
});

export const UserSystemRolesSchema = z.object({
  userId: UserSchema.shape.id,
  systemRoleId: SystemRoleSchema.shape.id,
});
