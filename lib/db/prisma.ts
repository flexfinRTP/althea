import { mkdirSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const SQLITE_URL = "file:../.data/althea.db";

export function ensureSqliteUrl(): string {
  mkdirSync(path.join(process.cwd(), ".data"), { recursive: true });
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost:5432")) {
    process.env.DATABASE_URL = SQLITE_URL;
  }
  return process.env.DATABASE_URL;
}

export function prismaEnabled(): boolean {
  if (process.env.VITEST === "true") return false;
  ensureSqliteUrl();
  return true;
}

export function prisma(): PrismaClient | null {
  if (!prismaEnabled()) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
