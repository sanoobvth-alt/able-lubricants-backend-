import { Router } from "express";
import * as c from "./customer.controller.js";
import {
  createCustomerSchema,
  customerIdSchema,
  customerListSchema,
  updateCustomerSchema,
} from "./customer.schema.js";
import { validate } from "../../shared/validate.js";
import { authenticate } from "../../middlewares/auth.js";
const router = Router();
router.use(authenticate);
router.get("/", validate("query", customerListSchema), c.list);
router.get("/:id", validate("params", customerIdSchema), c.get);
router.post("/", validate("body", createCustomerSchema), c.create);
router.patch(
  "/:id",
  validate("params", customerIdSchema),
  validate("body", updateCustomerSchema),
  c.update,
);
export default router;
