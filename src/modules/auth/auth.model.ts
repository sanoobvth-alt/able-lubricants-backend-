import { prisma } from "../../config/prisma.js";
export const authModel = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  createUser: (data: any) => prisma.user.create({ data }),
};
