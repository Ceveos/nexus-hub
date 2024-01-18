import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '~/shared/db/schema';
import { Env } from '../env';

const db = (env: Env) => drizzle(postgres(env.DATABASE_URL), {
  schema: {
    ...schema
  }
});

export default db;