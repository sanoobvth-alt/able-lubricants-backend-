-- Add brands, selectable units, and auditable stock movements.
CREATE TYPE "StockMovementType" AS ENUM ('OPENING_STOCK', 'ADJUSTMENT');
CREATE TYPE "StockDirection" AS ENUM ('IN', 'OUT');

CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

CREATE TABLE "units" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "units_name_key" ON "units"("name");

-- Preserve existing products by assigning a placeholder brand and making every
-- distinct legacy text unit into a selectable Unit record.
INSERT INTO "brands" ("id", "name", "updated_at")
VALUES ('00000000-0000-4000-8000-000000000001', 'Unassigned', CURRENT_TIMESTAMP);

INSERT INTO "units" ("id", "name", "updated_at")
SELECT (md5('able-unit:' || old_unit)::uuid), old_unit, CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "unit" AS old_unit FROM "products") legacy_units;

ALTER TABLE "products" ADD COLUMN "brand_id" UUID;
ALTER TABLE "products" ADD COLUMN "unit_id" UUID;
UPDATE "products" SET "brand_id" = '00000000-0000-4000-8000-000000000001';
UPDATE "products" p SET "unit_id" = u."id"
FROM "units" u WHERE u."name" = p."unit";
ALTER TABLE "products" ALTER COLUMN "brand_id" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "unit_id" SET NOT NULL;
ALTER TABLE "products" DROP COLUMN "sku";
ALTER TABLE "products" DROP COLUMN "unit";
CREATE INDEX "products_brand_id_idx" ON "products"("brand_id");
CREATE INDEX "products_unit_id_idx" ON "products"("unit_id");
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "stock_movements" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "direction" "StockDirection" NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "stock_after" DECIMAL(12,3) NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "created_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "stock_movements_product_id_created_at_idx" ON "stock_movements"("product_id", "created_at");
CREATE INDEX "stock_movements_created_by_id_idx" ON "stock_movements"("created_by_id");
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
