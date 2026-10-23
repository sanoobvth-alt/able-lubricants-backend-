import { z } from "zod";
export const saleIdSchema = z.object({ id: z.uuid() });
const saleLineSchema = z.object({ productId: z.uuid(), quantity: z.coerce.number().finite().positive().max(999999), discountAmount: z.coerce.number().finite().min(0).default(0) });
export const createSaleSchema = z.object({ idempotencyKey: z.string().trim().min(8).max(120), customerId: z.uuid().optional().nullable(), billDate: z.coerce.date().optional(), discountAmount: z.coerce.number().finite().min(0).default(0), items: z.array(saleLineSchema).min(1).max(100) });
