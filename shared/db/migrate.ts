import { migrate } from 'drizzle-orm/postgres-js/migrator';

console.log(process.env.DATABASE_URL);

import db from './db';

export const migrateDB = async () => {
  console.log('migrating db');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('db migrated');
};

migrateDB();