import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string, public details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, "Route not found"));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({ success: false, message: "Validation failed", errors: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })) });
  }
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ success: false, message: error.message, ...(error.details ? { details: error.details } : {}) });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return res.status(409).json({ success: false, message: "A record with these details already exists" });
    if (error.code === "P2025") return res.status(404).json({ success: false, message: "Record not found" });
    if (error.code === "P2003") return res.status(400).json({ success: false, message: "Related record does not exist" });
    if (error.code === "P2034") return res.status(409).json({ success: false, message: "Concurrent update conflict; retry the request" });
  }
  console.error(error);
  return res.status(500).json({ success: false, message: "Internal server error" });
}
