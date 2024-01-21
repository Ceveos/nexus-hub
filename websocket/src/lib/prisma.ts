import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Env } from '../env';

const createAcceleratedPrismaClient = (env: Env) => {
	return new PrismaClient({
		datasourceUrl: env.DATABASE_URL,
		log: ['error'],
	}).$extends(withAccelerate());
};

type PrismaClientAccelerated = ReturnType<typeof createAcceleratedPrismaClient>;

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientAccelerated | undefined;
};

const prisma = (env: Env) =>
	globalForPrisma.prisma ??
	new PrismaClient({
		datasourceUrl: env.DATABASE_URL,
		log: ['error'],
	}).$extends(withAccelerate());

export default prisma;
