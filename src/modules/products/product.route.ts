import { Router } from "express";
import * as c from "./product.controller.js";
import {
  createProductSchema,
  productIdSchema,
  productListSchema,
  updateProductSchema,
} from "./product.schema.js";
import { validate } from "../../shared/validate.js";
import { authenticate, authorize } from "../../middlewares/auth.js";
const router = Router();
router.get("/", authenticate, validate("query", productListSchema), c.list);
router.get("/:id", authenticate, validate("params", productIdSchema), c.get);
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "STAFF"),
  validate("body", createProductSchema),
  c.create,
);
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "STAFF"),
  validate("params", productIdSchema),
  validate("body", updateProductSchema),
  c.update,
);
export default router;
