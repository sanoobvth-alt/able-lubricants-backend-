import { z } from "zod";
export const dateRangeSchema = z
  .object({ from: z.coerce.date(), to: z.coerce.date() })
  .refine((x) => x.from <= x.to, "from must be on or before to");
