import { prisma } from "../../config/prisma.js";
export const saleModel = {
  findByIdempotencyKey: (key: string) =>
    prisma.sale.findUnique({
      where: { idempotencyKey: key },
      include: { items: true, payments: true },
    }),
};
