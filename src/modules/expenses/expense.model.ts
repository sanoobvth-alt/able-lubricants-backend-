import { prisma } from "../../config/prisma.js";
export const expenseModel = {
  list: (where: any, skip: number, take: number) =>
    prisma.expense.findMany({
      where,
      skip,
      take,
      orderBy: { expenseDate: "desc" },
    }),
  count: (where: any) => prisma.expense.count({ where }),
  get: (id: string) => prisma.expense.findUnique({ where: { id } }),
  create: (data: any) => prisma.expense.create({ data }),
  update: (id: string, data: any) =>
    prisma.expense.update({ where: { id }, data }),
};
