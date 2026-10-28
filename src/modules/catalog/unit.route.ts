import { Router } from "express";
import * as c from "./catalog.controller.js";
import {
  unitSchema,
  catalogIdSchema,
  catalogListSchema,
} from "./catalog.schema.js";
import { validate } from "../../shared/validate.js";
import { authenticate, authorize } from "../../middlewares/auth.js";
const router = Router();
router.use(authenticate);
router.get("/", validate("query", catalogListSchema), c.list("unit"));
router.get("/:id", validate("params", catalogIdSchema), c.get("unit"));
router.post(
  "/",
  authorize("ADMIN", "STAFF"),
  validate("body", unitSchema),
  c.create("unit"),
);
router.patch(
  "/:id",
  authorize("ADMIN", "STAFF"),
  validate("params", catalogIdSchema),
  validate("body", unitSchema.partial()),
  c.update("unit"),
);
export default router;
