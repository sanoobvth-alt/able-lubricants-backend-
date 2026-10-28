-- Remove the idempotency-key fields from sales and purchases.
DROP INDEX IF EXISTS "sales_idempotency_key_key";
ALTER TABLE "sales" DROP COLUMN IF EXISTS "idempotency_key";

DROP INDEX IF EXISTS "purchases_idempotency_key_key";
ALTER TABLE "purchases" DROP COLUMN IF EXISTS "idempotency_key";
