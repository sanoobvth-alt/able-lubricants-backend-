import type { Request, Response } from "express";
import * as s from "./customer.service.js";
export const list = async (req: Request, res: Response) =>
  res.json({ success: true, ...(await s.listCustomers(req.query)) });
export const get = async (req: Request, res: Response) =>
  res.json({
    success: true,
    data: await s.getCustomer(req.params.id as string),
  });
export const create = async (req: Request, res: Response) =>
  res
    .status(201)
    .json({ success: true, data: await s.createCustomer(req.body) });
export const update = async (req: Request, res: Response) =>
  res.json({
    success: true,
    data: await s.updateCustomer(req.params.id as string, req.body),
  });
