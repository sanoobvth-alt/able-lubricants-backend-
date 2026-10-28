import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../shared/errors.js";
import { pageMeta } from "../../shared/pagination.js";

const model = (kind: "brand" | "unit") => (prisma as any)[kind];
export async function list(kind: "brand" | "unit", q: any) {
  const where = {
    ...(q.active === undefined ? {} : { active: q.active }),
    ...(q.search ? { name: { contains: q.search, mode: "insensitive" } } : {}),
  };
  const [data, total] = await Promise.all([
    model(kind).findMany({
      where,
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      orderBy: { name: "asc" },
    }),
    model(kind).count({ where }),
  ]);
  return { data, meta: pageMeta(q.page, q.limit, total) };
}
export async function get(kind: "brand" | "unit", id: string) {
  const row = await model(kind).findUnique({ where: { id } });
  if (!row)
    throw new ApiError(404, `${kind === "brand" ? "Brand" : "Unit"} not found`);
  return row;
}
export const create = (kind: "brand" | "unit", data: any) =>
  model(kind).create({ data });
export async function update(kind: "brand" | "unit", id: string, data: any) {
  await get(kind, id);
  return model(kind).update({ where: { id }, data });
}
