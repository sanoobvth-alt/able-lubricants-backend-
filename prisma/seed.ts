import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "../src/config/env.js";

if (!env.ADMIN_PASSWORD) throw new Error("Set ADMIN_PASSWORD before running the seed script.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) });
try {
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: env.ADMIN_EMAIL.toLowerCase() },
    update: { name: env.ADMIN_NAME, passwordHash, role: "ADMIN", active: true },
    create: { name: env.ADMIN_NAME, email: env.ADMIN_EMAIL.toLowerCase(), passwordHash, role: "ADMIN" },
  });
  console.log(`Admin account ready: ${env.ADMIN_EMAIL}`);
} finally {
  await prisma.$disconnect();
}
