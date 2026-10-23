import { prisma } from "../../config/prisma.js";
export const supplierModel = {
  list: (where: any, skip: number, take: number) => prisma.supplier.findMany({ where, skip, take, orderBy: { name: "asc" } }),
  count: (where: any) => prisma.supplier.count({ where }),
  get: (id: string) => prisma.supplier.findUnique({ where: { id } }),
  create: (data: any) => prisma.supplier.create({ data }),
  update: (id: string, data: any) => prisma.supplier.update({ where: { id }, data }),
};
