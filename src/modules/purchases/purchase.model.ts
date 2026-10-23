import { prisma } from "../../config/prisma.js";
export const purchaseModel = { findByIdempotencyKey: (key: string) => prisma.purchase.findUnique({ where: { idempotencyKey: key }, include: { items: true, payments: true } }) };
