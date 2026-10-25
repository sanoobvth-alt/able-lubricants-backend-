import { Router } from "express";
import * as c from "./supplier.controller.js";
import {
  createSupplierSchema,
  supplierIdSchema,
  supplierListSchema,
  updateSupplierSchema,
} from "./supplier.schema.js";
import { validate } from "../../shared/validate.js";
import { authenticate } from "../../middlewares/auth.js";
const router = Router();
router.use(authenticate);
router.get("/", validate("query", supplierListSchema), c.list);
router.get("/:id", validate("params", supplierIdSchema), c.get);
router.post("/", validate("body", createSupplierSchema), c.create);
router.patch(
  "/:id",
  validate("params", supplierIdSchema),
  validate("body", updateSupplierSchema),
  c.update,
);
export default router;
