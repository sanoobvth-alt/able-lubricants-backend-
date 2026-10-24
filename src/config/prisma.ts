
import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in the environment variables");
}

const adapter = new PrismaPg({
  connectionString,
  max: 10,
  connectionTimeoutMillis: 5000,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
