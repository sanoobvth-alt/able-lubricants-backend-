import type { Response } from "express";
export function sendData(res: Response, data: unknown, message?: string, status = 200) {
  return res.status(status).json({ success: true, ...(message ? { message } : {}), data });
}
