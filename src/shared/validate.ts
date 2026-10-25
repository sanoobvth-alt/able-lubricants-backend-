import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export const validate =
  (target: "body" | "params" | "query", schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) return next(result.error);
    Object.defineProperty(req, target, {
      value: result.data,
      configurable: true,
      enumerable: true,
      writable: true,
    });
    next();
  };
