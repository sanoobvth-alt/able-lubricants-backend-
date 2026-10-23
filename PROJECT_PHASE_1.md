# Able Lubes backend — Phase 1 proposal

## Repository inspection

The workspace was empty when inspected: there was no existing application, package manifest, source tree, Prisma schema, or dependency lockfile to preserve.

## Proposed architecture

Use a TypeScript, ES module, feature based monolith with Express 5, PostgreSQL, Prisma ORM 7, Zod, and REST endpoints under `/api/v1`. Keep HTTP concerns in controllers and routes, business rules in services, and Prisma access in feature models. Shared infrastructure belongs in `src/config`, `src/middlewares`, and `src/shared`; the app entrypoint should mount a central router and finish with not-found and error middleware.

```text
src/
  app.ts
  server.ts
  config/       environment and Prisma client
  middlewares/  validation, errors, auth when needed
  modules/
    products/ customers/ suppliers/
    purchases/ sales/ payments/ expenses/ reports/
    auth/       only if authentication is required
  shared/       response helpers, errors, pagination, money helpers
prisma/
  schema.prisma
  migrations/
  seed.ts
generated/prisma/  generated Prisma Client (not hand edited)
```

The first implementation sequence should establish environment validation, Prisma/PostgreSQL, app/server bootstrapping and shared errors, then build catalog and party records before purchase and sales workflows. Each invoice posting and stock update must run in a database transaction. Stock changes should be guarded against concurrent overselling, and reversal/cancellation must be idempotent.

## Initial schema proposal

The draft at `prisma/schema.prisma` covers the approved core tables: User, Product, Customer, Supplier, Sale/SaleItem, CustomerPayment, Purchase/PurchaseItem, SupplierPayment, and Expense. Units remain a text field on Product. It intentionally omits StockMovement, batches, payment allocation tables, branches, opening balances, expiry tracking, and tax policy fields pending confirmation.

Amounts use PostgreSQL `Decimal` fields to avoid floating point money arithmetic. Quantities use a three-decimal scale to allow fractional units; confirm if all products are sold only as whole units. The Product stock field is persisted but should only be changed by purchase posting, sale posting, or a separately authorized adjustment workflow (the adjustment workflow is outside the approved table scope).

## Decisions needed before finalizing schema/business behavior

1. Are taxes used? If yes, confirm whether tax is inclusive/exclusive and the required tax types/rates.
2. What does “our rate” on PurchaseItem mean? The draft omits it until defined.
3. Which costing method supplies SaleItem's historical cost snapshot (for example, last purchase cost or weighted average)? Until agreed, the field is nullable and profit reports must not claim reliable COGS.
4. Are invoice cancellations required? The draft has a status field to support lifecycle decisions, but posting/cancel rules and who may cancel need confirmation.
5. Should a customer payment always be linked to one sale, or may unallocated advances be accepted? The draft supports an optional one-sale link and no cross-invoice allocations; overpayments should be rejected until policy is confirmed.
6. Is authentication required for this single-shop deployment, and are there multiple roles? User is included as a minimal optional account model; authorization policy is not assumed.

## Prisma 7 setup direction

Use Prisma's v7 `prisma-client` generator with an explicit generated output path, a PostgreSQL driver adapter (`@prisma/adapter-pg` with `pg`), and a root Prisma config for the CLI datasource URL. The reference setup guide's `prisma-client-js`, schema-level `url`, and `@prisma/client` import examples are v6-era patterns; Prisma 7 requires the generated client output and driver adapter approach. The setup and migration commands will be added in Phase 2 after this proposal is approved/refined.

## Phase 1 completion

At the end of Phase 1, no business modules or migrations had been implemented. The subsequent project setup added the TypeScript/Express infrastructure and the modules documented in `README.md`. No database migration has been created because a configured PostgreSQL database is not available in this workspace yet.
