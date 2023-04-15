import { db } from '@/db/index.js';
import { SystemRoleID } from '@/shared/constants/index.js';
import { bcryptUtil } from '@/utils/index.js';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  // Follow https://github.com/kysely-org/kysely/issues/257 for fine-grained transaction API.
  // For now, everything will be inside `execute()`.

  await db
    .transaction()
    .setIsolationLevel('serializable')
    .execute(async (trx) => {
      console.info('Seeding System Roles...');
      const superadminSystemRole = await trx
        .insertInto('system_roles')
        .values({
          id: SystemRoleID.SUPER_ADMINISTRATOR,
          name: 'Super Administrator',
          description: 'The chosen ones',
        })
        .onConflict(
          // https://kysely-org.github.io/kysely/classes/InsertQueryBuilder.html#onConflict
          (oc) => oc.column('id').doNothing(),
        )
        .returningAll()
        .executeTakeFirst();

      console.info('Seeding Users...');
      const superadmin = await trx
        .insertInto('users')
        .values({
          id: uuidv4(),
          email: 'superadmin@app.com',
          hashedPassword: await bcryptUtil.generateHash('password'),
          firstName: 'Superadmin',
          lastName: 'SA',
          updatedAt: new Date(),
        })
        .onConflict((oc) => oc.column('email').doNothing())
        .returningAll()
        .executeTakeFirst();

      if (superadmin && superadminSystemRole) {
        console.info('Seeding Super Admin Role for seeded Super Admin User...');
        await trx
          .insertInto('user_system_roles')
          .values({
            userId: superadmin.id,
            systemRoleId: superadminSystemRole.id,
          })
          .onConflict((oc) => oc.columns(['userId', 'systemRoleId']).doNothing())
          .execute();
      }
    });
}
seed()
  .catch(async (err) => {
    console.error(err);
  })
  .finally(async () => {
    db.destroy();
  });
