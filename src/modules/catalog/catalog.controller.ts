import type { Request, Response } from "express";
import * as service from "./catalog.service.js";

export const list =
  (kind: "brand" | "unit") => async (req: Request, res: Response) =>
    res.json({ success: true, ...(await service.list(kind, req.query)) });
export const get =
  (kind: "brand" | "unit") => async (req: Request, res: Response) =>
    res.json({
      success: true,
      data: await service.get(kind, req.params.id as string),
    });
export const create =
  (kind: "brand" | "unit") => async (req: Request, res: Response) =>
    res
      .status(201)
      .json({ success: true, data: await service.create(kind, req.body) });
export const update =
  (kind: "brand" | "unit") => async (req: Request, res: Response) =>
    res.json({
      success: true,
      data: await service.update(kind, req.params.id as string, req.body),
    });
