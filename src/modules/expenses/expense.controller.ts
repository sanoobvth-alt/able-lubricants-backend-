import type { Request, Response } from "express";
import * as s from "./expense.service.js";
export const list = async (req: Request, res: Response) => res.json({ success: true, ...(await s.listExpenses(req.query)) });
export const create = async (req: Request, res: Response) => res.status(201).json({ success: true, data: await s.createExpense(req.body) });
export const update = async (req: Request, res: Response) => res.json({ success: true, data: await s.updateExpense(req.params.id as string, req.body) });
