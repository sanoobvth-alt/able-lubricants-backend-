import type { Request, Response } from "express";
import * as s from "./supplier.service.js";
export const list = async (req: Request, res: Response) => res.json({ success: true, ...(await s.listSuppliers(req.query)) });
export const get = async (req: Request, res: Response) => res.json({ success: true, data: await s.getSupplier(req.params.id as string) });
export const create = async (req: Request, res: Response) => res.status(201).json({ success: true, data: await s.createSupplier(req.body) });
export const update = async (req: Request, res: Response) => res.json({ success: true, data: await s.updateSupplier(req.params.id as string, req.body) });
