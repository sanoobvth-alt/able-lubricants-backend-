import type { Request, Response } from "express";
import { createUser, login } from "./auth.service.js";
export async function loginController(req: Request, res: Response) {
  return res.json({
    success: true,
    data: await login(req.body.email, req.body.password),
  });
}
export async function createUserController(req: Request, res: Response) {
  return res
    .status(201)
    .json({ success: true, data: await createUser(req.body) });
}
