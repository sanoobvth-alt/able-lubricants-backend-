import { describe, expect, it } from "vitest";
import { calculateInvoice, calculateLine, hasAvailableStock } from "./money.js";

describe("inventory and invoice arithmetic", () => {
  it("calculates a line total using decimal-safe arithmetic", () => {
    const line = calculateLine("99.99", "2", "0.02");
    expect(line.subtotal.toFixed(2)).toBe("199.98");
    expect(line.total.toFixed(2)).toBe("199.96");
  });

  it("rejects a discount greater than the line subtotal", () => {
    expect(() => calculateLine("10.00", "1", "10.01")).toThrow(RangeError);
  });

  it("calculates the invoice after both line and invoice discounts", () => {
    const totals = calculateInvoice("199.98", "0.02", "5.00");
    expect(totals.discountAmount.toFixed(2)).toBe("5.02");
    expect(totals.total.toFixed(2)).toBe("194.96");
    expect(() => calculateInvoice("10.00", "2.00", "8.01")).toThrow(RangeError);
  });

  it("checks stock quantities without floating point comparison", () => {
    expect(hasAvailableStock("0.300", "0.3")).toBe(true);
    expect(hasAvailableStock("0.299", "0.3")).toBe(false);
  });
});
