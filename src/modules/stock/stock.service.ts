import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../shared/errors.js";
import { pageMeta } from "../../shared/pagination.js";

const dec = (n: number | string) => new Prisma.Decimal(n);
export async function createAdjustment(input: any, userId: string) {
  return prisma.$transaction(
    async (tx) => {
      const product = await tx.product.findFirst({
        where: { id: input.productId, active: true },
      });
      if (!product) throw new ApiError(404, "Active product not found");
      const quantity = dec(input.quantity);
      if (input.direction === "OUT" && product.currentStock.lt(quantity))
        throw new ApiError(409, "Adjustment would make stock negative");
      const next =
        input.direction === "IN"
          ? product.currentStock.add(quantity)
          : product.currentStock.sub(quantity);
      const changed = await tx.product.updateMany({
        where: { id: product.id, currentStock: product.currentStock },
        data: { currentStock: next },
      });
      if (changed.count !== 1)
        throw new ApiError(
          409,
          "Concurrent stock change; retry the adjustment",
        );
      return tx.stockMovement.create({
        data: {
          productId: product.id,
          type: "ADJUSTMENT",
          direction: input.direction,
          quantity,
          stockAfter: next,
          reason: input.reason,
          notes: input.notes ?? null,
          createdById: userId,
        },
        include: {
          product: { include: { brand: true, unit: true } },
          createdBy: { select: { id: true, name: true, email: true } },
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}
export async function listMovements(q: any) {
  const where = q.productId ? { productId: q.productId } : {};
  const [data, total] = await Promise.all([
    prisma.stockMovement.findMany({
      where,
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    }),
    prisma.stockMovement.count({ where }),
  ]);
  return {
    data: data.map((m) => ({
      ...m,
      quantity: m.quantity.toString(),
      stockAfter: m.stockAfter.toString(),
    })),
    meta: pageMeta(q.page, q.limit, total),
  };
}
