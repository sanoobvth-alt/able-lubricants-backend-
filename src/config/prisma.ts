import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { env } from "./env.js";

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
