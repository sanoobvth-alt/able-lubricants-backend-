import { z } from "zod";
import { paginationSchema } from "../../shared/pagination.js";
export const supplierIdSchema = z.object({ id: z.uuid() });
export const createSupplierSchema = z.object({
  name: z.string().trim().min(1).max(160),
  phone: z.string().trim().max(40).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  active: z.boolean().optional(),
});
export const updateSupplierSchema = createSupplierSchema.partial();
export const supplierListSchema = paginationSchema;
