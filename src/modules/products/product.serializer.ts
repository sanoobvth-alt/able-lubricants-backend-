export const productSerializer = (p: any) => ({ ...p, sellingPrice: p.sellingPrice.toString(), mrp: p.mrp?.toString() ?? null, currentStock: p.currentStock.toString() });
