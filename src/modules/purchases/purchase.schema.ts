import { z } from "zod";
export const purchaseIdSchema = z.object({ id: z.uuid() });
const purchaseLineSchema = z.object({
  productId: z.uuid(),
  quantity: z.coerce.number().finite().positive().max(999999),
  supplierRate: z.coerce.number().finite().min(0).max(9999999999.99),
});
export const createPurchaseSchema = z.object({
  supplierId: z.uuid(),
  supplierInvoiceNumber: z.string().trim().max(100).optional(),
  purchaseDate: z.coerce.date().optional(),
  discountAmount: z.coerce.number().finite().min(0).default(0),
  items: z.array(purchaseLineSchema).min(1).max(100),
});
