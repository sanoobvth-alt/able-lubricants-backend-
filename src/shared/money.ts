import { Prisma } from "../../generated/prisma/client.js";
const decimal = (value: string | number | Prisma.Decimal) => new Prisma.Decimal(value);
export function calculateLine(unitPrice: string | number | Prisma.Decimal, quantity: string | number | Prisma.Decimal, discount: string | number | Prisma.Decimal = 0) {
  const subtotal = decimal(unitPrice).mul(quantity).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
  const discountAmount = decimal(discount).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
  if (discountAmount.isNegative() || discountAmount.gt(subtotal)) throw new RangeError("Discount must be between zero and the line subtotal");
  return { subtotal, discountAmount, total: subtotal.sub(discountAmount) };
}
export function calculateInvoice(subtotalInput: string | number | Prisma.Decimal, lineDiscountInput: string | number | Prisma.Decimal, invoiceDiscountInput: string | number | Prisma.Decimal) {
  const subtotal = decimal(subtotalInput);
  const lineDiscount = decimal(lineDiscountInput);
  const invoiceDiscount = decimal(invoiceDiscountInput);
  if (lineDiscount.isNegative() || invoiceDiscount.isNegative() || lineDiscount.add(invoiceDiscount).gt(subtotal)) throw new RangeError("Total discounts cannot exceed subtotal");
  return { subtotal: subtotal.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP), discountAmount: lineDiscount.add(invoiceDiscount).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP), total: subtotal.sub(lineDiscount).sub(invoiceDiscount).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP) };
}
export function hasAvailableStock(currentStock: string | number | Prisma.Decimal, requested: string | number | Prisma.Decimal) {
  return decimal(currentStock).gte(decimal(requested));
}
