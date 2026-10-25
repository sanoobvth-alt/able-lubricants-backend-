import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../shared/errors.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: "ADMIN" | "STAFF" };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
      throw new ApiError(401, "Authentication required");
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET) as {
      sub: string;
      role: "ADMIN" | "STAFF";
    };
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(401, "Invalid or expired token"),
    );
  }
}

export function authorize(...roles: Array<"ADMIN" | "STAFF">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, "Authentication required"));
    if (!roles.includes(req.user.role))
      return next(new ApiError(403, "Insufficient permission"));
    next();
  };
}
