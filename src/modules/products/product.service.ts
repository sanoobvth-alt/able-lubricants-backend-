import { ApiError } from "../../shared/errors.js";
import { pageMeta } from "../../shared/pagination.js";
import { productModel } from "./product.model.js";
import { productSerializer } from "./product.serializer.js";

export async function listProducts(query: any) {
  const { page, limit, search, active } = query;
  const where: any = {
    ...(active === undefined ? {} : { active }),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [rows, total] = await Promise.all([
    productModel.list(where, (page - 1) * limit, limit),
    productModel.count(where),
  ]);
  return {
    data: rows.map(productSerializer),
    meta: pageMeta(page, limit, total),
  };
}
export async function getProduct(id: string) {
  const p = await productModel.get(id);
  if (!p) throw new ApiError(404, "Product not found");
  return productSerializer(p);
}
export async function createProduct(data: any) {
  return productSerializer(await productModel.create(data));
}
export async function updateProduct(id: string, data: any) {
  await getProduct(id);
  return productSerializer(await productModel.update(id, data));
}
