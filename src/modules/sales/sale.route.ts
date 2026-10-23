import { Router } from "express";
import * as c from "./sale.controller.js";
import { createSaleSchema, saleIdSchema } from "./sale.schema.js";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validate } from "../../shared/validate.js";
const router = Router(); router.use(authenticate);
router.post("/", validate("body", createSaleSchema), c.create);
router.post("/:id/cancel", authorize("ADMIN"), validate("params", saleIdSchema), c.cancel);
export default router;
