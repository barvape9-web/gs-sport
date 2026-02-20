import { PrismaClient } from '@/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return databaseUrl;

  if (process.env.NODE_ENV !== 'production') return databaseUrl;

  try {
    const parsed = new URL(databaseUrl);
    parsed.searchParams.set('sslmode', 'no-verify');
    return parsed.toString();
  } catch {
    return databaseUrl;
  }
}

function createPrismaClient() {
  const pool = new Pool({
    connectionString: getDatabaseUrl(),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
