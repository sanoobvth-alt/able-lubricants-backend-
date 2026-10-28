export const productSerializer = (p: any) => ({
  ...p,
  sellingPrice: p.sellingPrice.toString(),
  mrp: p.mrp?.toString() ?? null,
  currentStock: p.currentStock.toString(),
  brand: p?.brand?.name,
  unit: p?.unit?.name,
});
