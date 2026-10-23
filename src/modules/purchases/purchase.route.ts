import { Router } from "express";
import * as c from "./purchase.controller.js";
import { createPurchaseSchema, purchaseIdSchema } from "./purchase.schema.js";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validate } from "../../shared/validate.js";
const router = Router(); router.use(authenticate);
router.post("/", validate("body", createPurchaseSchema), c.create);
router.post("/:id/cancel", authorize("ADMIN"), validate("params", purchaseIdSchema), c.cancel);
export default router;
