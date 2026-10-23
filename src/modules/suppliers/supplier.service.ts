import { ApiError } from "../../shared/errors.js";
import { pageMeta } from "../../shared/pagination.js";
import { supplierModel } from "./supplier.model.js";
import { supplierSerializer } from "./supplier.serializer.js";
export async function listSuppliers(q: any) {
  const where = q.search ? { OR: [{ name: { contains: q.search, mode: "insensitive" } }, { phone: { contains: q.search } }] } : {};
  const [data, total] = await Promise.all([supplierModel.list(where, (q.page - 1) * q.limit, q.limit), supplierModel.count(where)]);
  return { data: data.map(supplierSerializer), meta: pageMeta(q.page, q.limit, total) };
}
export async function getSupplier(id: string) { const x = await supplierModel.get(id); if (!x) throw new ApiError(404, "Supplier not found"); return supplierSerializer(x); }
export async function createSupplier(data: any) { return supplierSerializer(await supplierModel.create(data)); }
export async function updateSupplier(id: string, data: any) { await getSupplier(id); return supplierSerializer(await supplierModel.update(id, data)); }
