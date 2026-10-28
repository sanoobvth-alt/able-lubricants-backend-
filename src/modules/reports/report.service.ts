import { reportModel } from "./report.model.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { env } from "../../config/env.js";
const decimal = (value: any) => new Prisma.Decimal(value ?? 0);
const sum = (values: any[]) =>
  values.reduce((acc, v) => acc.add(decimal(v)), decimal(0)).toFixed(2);
const bucketDate = (date: Date, monthly = false) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: env.BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const fields = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return monthly
    ? `${fields.year}-${fields.month}`
    : `${fields.year}-${fields.month}-${fields.day}`;
};
export async function salesReport(from: Date, to: Date) {
  const rows = await reportModel.sales(from, to);
  const groups = new Map<string, any>();
  for (const row of rows) {
    const key = bucketDate(row.billDate);
    const group = groups.get(key) ?? {
      date: key,
      invoices: 0,
      subtotal: decimal(0),
      discounts: decimal(0),
      sales: decimal(0),
    };
    group.invoices++;
    group.subtotal = group.subtotal.add(row.subtotal);
    group.discounts = group.discounts.add(row.discountAmount);
    group.sales = group.sales.add(row.totalAmount);
    groups.set(key, group);
  }
  return {
    totals: {
      invoices: rows.length,
      sales: sum(rows.map((r) => r.totalAmount)),
      discounts: sum(rows.map((r) => r.discountAmount)),
    },
    days: [...groups.values()].map((x) => ({
      ...x,
      subtotal: x.subtotal.toFixed(2),
      discounts: x.discounts.toFixed(2),
      sales: x.sales.toFixed(2),
    })),
  };
}
export async function purchaseReport(from: Date, to: Date) {
  const rows = await reportModel.purchases(from, to);
  return {
    count: rows.length,
    total: sum(rows.map((r) => r.totalAmount)),
    data: rows,
  };
}
export async function expenseReport(from: Date, to: Date) {
  const rows = await reportModel.expenses(from, to);
  const days = new Map<string, Prisma.Decimal>();
  for (const row of rows) {
    const key = bucketDate(row.expenseDate);
    days.set(key, (days.get(key) ?? decimal(0)).add(row.amount));
  }
  return {
    count: rows.length,
    total: sum(rows.map((r) => r.amount)),
    days: [...days.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, total: amount.toFixed(2) })),
    data: rows,
  };
}
export async function customerOutstanding() {
  const rows = await reportModel.customerSales();
  const balances = new Map<string, any>();
  for (const row of rows) {
    const customer = row.customer!;
    console.log(customer, "====");

    const x = balances.get(customer.id) ?? {
      ...customer,
      invoiced: decimal(0),
      paid: decimal(0),
    };
    x.invoiced = x.invoiced.add(row.totalAmount);
    x.paid = x.paid.add(sum(row.payments.map((p) => p.amount)));
    balances.set(customer.id, x);
  }
  return [...balances.values()]
    .filter((x) => x.invoiced.sub(x.paid).gt(0))
    .map((x) => ({
      ...x,
      outstanding: Prisma.Decimal.max(0, x.invoiced.sub(x.paid)).toFixed(2),
      invoiced: x.invoiced.toFixed(2),
      paid: x.paid.toFixed(2),
    }));
}
export async function supplierOutstanding() {
  const rows = await reportModel.supplierPurchases();
  const balances = new Map<string, any>();
  for (const row of rows) {
    const supplier = row.supplier;
    const x = balances.get(supplier.id) ?? {
      ...supplier,
      purchased: decimal(0),
      paid: decimal(0),
    };
    x.purchased = x.purchased.add(row.totalAmount);
    x.paid = x.paid.add(sum(row.payments.map((p) => p.amount)));
    balances.set(supplier.id, x);
  }
  return [...balances.values()].map((x) => ({
    ...x,
    outstanding: Prisma.Decimal.max(0, x.purchased.sub(x.paid)).toFixed(2),
    purchased: x.purchased.toFixed(2),
    paid: x.paid.toFixed(2),
  }));
}
export async function monthlySummary(from: Date, to: Date) {
  const [sales, purchases, expenses] = await Promise.all([
    reportModel.sales(from, to),
    reportModel.purchases(from, to),
    reportModel.expenses(from, to),
  ]);
  const groups = new Map<string, any>();
  const apply = (date: Date, key: string, amount: any) => {
    const bucket = bucketDate(date, true);
    const x = groups.get(bucket) ?? {
      month: bucket,
      sales: decimal(0),
      purchases: decimal(0),
      expenses: decimal(0),
    };
    x[key] = x[key].add(amount);
    groups.set(bucket, x);
  };
  sales.forEach((x) => apply(x.billDate, "sales", x.totalAmount));
  purchases.forEach((x) => apply(x.purchaseDate, "purchases", x.totalAmount));
  expenses.forEach((x) => apply(x.expenseDate, "expenses", x.amount));
  return [...groups.values()].map((x) => ({
    ...x,
    sales: x.sales.toFixed(2),
    purchases: x.purchases.toFixed(2),
    expenses: x.expenses.toFixed(2),
  }));
}
