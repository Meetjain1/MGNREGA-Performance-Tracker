import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient | any };

let _prisma: PrismaClient | any = undefined;
let isDbAvailable = false;

// Check if DATABASE_URL is properly configured
const isDatabaseConfigured = () => {
  const dbUrl = process.env.DATABASE_URL;
  return dbUrl && dbUrl.trim() !== '' && !dbUrl.includes('your-database-url-here');
};

try {
  if (!isDatabaseConfigured()) {
    console.warn('DATABASE_URL not configured, database features will be disabled');
    throw new Error('Database not configured');
  }

  _prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _prisma;
  isDbAvailable = true;
} catch (err) {
  console.error('Prisma initialization failed, using fallback mode:', err instanceof Error ? err.message : err);

  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      return (..._args: any[]) => {
        return Promise.reject(new Error('Database not available'));
      };
    },
  };

  _prisma = new Proxy({}, handler);
  isDbAvailable = false;
}

export const prisma = _prisma;
export const isDatabaseAvailable = isDbAvailable;
