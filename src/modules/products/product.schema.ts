import { z } from "zod";
import { paginationSchema } from "../../shared/pagination.js";
const money = z.coerce.number().finite().min(0).max(9999999999.99);
export const productIdSchema = z.object({ id: z.uuid() });
export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(160),
  sku: z.string().trim().max(80).optional().nullable(),
  unit: z.string().trim().min(1).max(40),
  sellingPrice: money,
  mrp: money.optional().nullable(),
  active: z.boolean().optional(),
});
export const updateProductSchema = createProductSchema.partial();
export const productListSchema = paginationSchema.extend({
  active: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});
