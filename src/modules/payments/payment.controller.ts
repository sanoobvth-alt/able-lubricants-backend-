import type { Request, Response } from "express";
import * as service from "./payment.service.js";
export const customerPayment = async (req: Request, res: Response) =>
  res.status(201).json({
    success: true,
    data: await service.recordCustomerPayment(req.body),
  });
export const supplierPayment = async (req: Request, res: Response) =>
  res.status(201).json({
    success: true,
    data: await service.recordSupplierPayment(req.body),
  });
