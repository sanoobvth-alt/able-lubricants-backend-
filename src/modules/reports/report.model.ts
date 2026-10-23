import { prisma } from "../../config/prisma.js";
export const reportModel = {
  sales: (from: Date, to: Date) => prisma.sale.findMany({ where: { status: "POSTED", billDate: { gte: from, lte: to } }, select: { billDate: true, subtotal: true, discountAmount: true, totalAmount: true, items: { select: { lineTotal: true, historicalCostSnapshot: true } } }, orderBy: { billDate: "asc" } }),
  purchases: (from: Date, to: Date) => prisma.purchase.findMany({ where: { status: "POSTED", purchaseDate: { gte: from, lte: to } }, select: { purchaseDate: true, subtotal: true, discountAmount: true, totalAmount: true }, orderBy: { purchaseDate: "asc" } }),
  expenses: (from: Date, to: Date) => prisma.expense.findMany({ where: { expenseDate: { gte: from, lte: to } }, select: { expenseDate: true, amount: true } }),
  customerSales: () => prisma.sale.findMany({ where: { status: "POSTED", customerId: { not: null } }, select: { customerId: true, totalAmount: true, customer: { select: { id: true, name: true, phone: true } }, payments: { select: { amount: true } } } }),
  supplierPurchases: () => prisma.purchase.findMany({ where: { status: "POSTED" }, select: { supplierId: true, totalAmount: true, supplier: { select: { id: true, name: true, phone: true } }, payments: { select: { amount: true } } } }),
};
