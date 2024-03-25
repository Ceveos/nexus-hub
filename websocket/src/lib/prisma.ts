import { Pool } from '@prisma/pg-worker'
import { PrismaPg } from '@prisma/adapter-pg-worker'
import { PrismaClient } from '@prisma/client';
import { Env } from '../env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = (env: Env) => {
	const pool = new Pool({ connectionString: env.DATABASE_URL });
	const adapter = new PrismaPg(pool)
	return globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
		log: ['error'],
	});
}

export default prisma;
