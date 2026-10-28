import { Router } from "express";
import * as c from "./stock.controller.js";
import { adjustmentSchema, movementListSchema } from "./stock.schema.js";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validate } from "../../shared/validate.js";
const router = Router();
router.use(authenticate);
router.get("/", validate("query", movementListSchema), c.list);
router.post(
  "/",
  authorize("ADMIN"),
  validate("body", adjustmentSchema),
  c.create,
);
export default router;
