export const expenseSerializer = (expense: any) => ({ ...expense, amount: expense.amount.toString() });
