import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma.js";

try {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the initial admin",
    );
  }

  const email = process.env.ADMIN_EMAIL.toLowerCase();
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD,
    12,
  );

  await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
    },
    create: {
      name: process.env.ADMIN_NAME || "System Administrator",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.info(`Initial admin ensured for ${email}`);
} finally {
  await prisma.$disconnect();
}
