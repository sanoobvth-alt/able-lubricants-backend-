import { ApiError } from "../../shared/errors.js";
import { pageMeta } from "../../shared/pagination.js";
import { customerModel } from "./customer.model.js";
import { customerSerializer } from "./customer.serializer.js";
export async function listCustomers(q: any) {
  const where = q.search ? { OR: [{ name: { contains: q.search, mode: "insensitive" } }, { phone: { contains: q.search } }] } : {};
  const [data, total] = await Promise.all([customerModel.list(where, (q.page - 1) * q.limit, q.limit), customerModel.count(where)]);
  return { data: data.map(customerSerializer), meta: pageMeta(q.page, q.limit, total) };
}
export async function getCustomer(id: string) { const x = await customerModel.get(id); if (!x) throw new ApiError(404, "Customer not found"); return customerSerializer(x); }
export async function createCustomer(data: any) { return customerSerializer(await customerModel.create(data)); }
export async function updateCustomer(id: string, data: any) { await getCustomer(id); return customerSerializer(await customerModel.update(id, data)); }
