import { Router } from "express";
import * as c from "./catalog.controller.js";
import {
  brandSchema,
  catalogIdSchema,
  catalogListSchema,
} from "./catalog.schema.js";
import { validate } from "../../shared/validate.js";
import { authenticate, authorize } from "../../middlewares/auth.js";
const router = Router();
router.use(authenticate);
router.get("/", validate("query", catalogListSchema), c.list("brand"));
router.get("/:id", validate("params", catalogIdSchema), c.get("brand"));
router.post(
  "/",
  authorize("ADMIN", "STAFF"),
  validate("body", brandSchema),
  c.create("brand"),
);
router.patch(
  "/:id",
  authorize("ADMIN", "STAFF"),
  validate("params", catalogIdSchema),
  validate("body", brandSchema.partial()),
  c.update("brand"),
);
export default router;
