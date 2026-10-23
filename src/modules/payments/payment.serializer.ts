export const paymentSerializer = (payment: any) => ({ ...payment, amount: payment.amount.toString() });
