import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  // allow Prisma generate without a DB for local dev, but warn when running
  // the server if DATABASE_URL is not configured.
  // We don't throw here to allow generating the client in CI/dev.
  // The server will still error if DATABASE_URL is missing at runtime.
}

export const prisma = new PrismaClient();
