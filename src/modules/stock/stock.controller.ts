import type { Request, Response } from "express";
import * as service from "./stock.service.js";
export const create = async (req: Request, res: Response) =>
  res
    .status(201)
    .json({
      success: true,
      data: await service.createAdjustment(req.body, req.user!.id),
    });
export const list = async (req: Request, res: Response) =>
  res.json({ success: true, ...(await service.listMovements(req.query)) });
