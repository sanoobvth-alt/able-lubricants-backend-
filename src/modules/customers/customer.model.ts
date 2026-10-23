import { prisma } from "../../config/prisma.js";
export const customerModel = {
  list: (where: any, skip: number, take: number) => prisma.customer.findMany({ where, skip, take, orderBy: { name: "asc" } }),
  count: (where: any) => prisma.customer.count({ where }),
  get: (id: string) => prisma.customer.findUnique({ where: { id } }),
  create: (data: any) => prisma.customer.create({ data }),
  update: (id: string, data: any) => prisma.customer.update({ where: { id }, data }),
};
