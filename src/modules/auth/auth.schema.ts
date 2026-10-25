import { z } from "zod";
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export const createUserSchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.email(),
  password: z.string().min(6).max(200),
  role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
});
