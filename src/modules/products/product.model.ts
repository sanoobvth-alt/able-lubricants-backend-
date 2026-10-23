import { prisma } from "../../config/prisma.js";
export const productModel = {
  list: (where: any, skip: number, take: number) => prisma.product.findMany({ where, skip, take, orderBy: { name: "asc" } }),
  count: (where: any) => prisma.product.count({ where }),
  get: (id: string) => prisma.product.findUnique({ where: { id } }),
  create: (data: any) => prisma.product.create({ data }),
  update: (id: string, data: any) => prisma.product.update({ where: { id }, data }),
};
