import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL?.replace(/^﻿/, "").trim(),
    ssl: { rejectUnauthorized: false },
    max: 3,
    // Fail a stuck connect within 10s (Neon waking from idle) so callers can
    // retry, instead of hanging until the whole function times out.
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Reuse the client across warm serverless invocations (not just in dev) so we
// don't open a fresh Neon connection on every request.
globalForPrisma.prisma = prisma;

export default prisma;
