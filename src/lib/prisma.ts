import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient | any };

let _prisma: PrismaClient | any = undefined;

try {
  _prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _prisma;
} catch (err) {
  // If Prisma fails to initialize (missing/invalid DATABASE_URL in production),
  // export a safe proxy that returns rejected promises so callers can handle DB absence.
  console.error('Prisma initialization failed:', err instanceof Error ? err.message : err);

  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      // Return a function that rejects when called, to mimic async Prisma methods
      return (..._args: any[]) => {
        return Promise.reject(new Error('Prisma client not available'));
      };
    },
  };

  _prisma = new Proxy({}, handler);
}

export const prisma = _prisma;
