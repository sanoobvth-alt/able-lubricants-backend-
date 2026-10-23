import { createPurchase as postPurchase, cancelPurchase as reversePurchase } from "../transactions/transaction.service.js";
import { purchaseSerializer } from "./purchase.serializer.js";
export const createPurchase = async (data: any) => purchaseSerializer(await postPurchase(data));
export const cancelPurchase = async (id: string) => purchaseSerializer(await reversePurchase(id));
