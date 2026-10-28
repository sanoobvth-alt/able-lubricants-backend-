import { z } from "zod";
import { paginationSchema } from "../../shared/pagination.js";

const base = {
  name: z.string().trim().min(1).max(100),
  active: z.boolean().optional(),
};
export const catalogIdSchema = z.object({ id: z.uuid() });
export const brandSchema = z.object(base);
export const unitSchema = z.object({
  ...base,
  symbol: z.string().trim().max(20).optional().nullable(),
});
export const catalogListSchema = paginationSchema.extend({
  active: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .default(true),
});
