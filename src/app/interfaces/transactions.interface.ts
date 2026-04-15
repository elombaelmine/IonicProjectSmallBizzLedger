export interface Transactions {
    id?: string;
    type: 'Income' | 'Expense';
    amount: number;
    date: string;
    description: string;
    category: 'Sales' | 'Marketing' | 'Salary' | 'Utility' | 'Logistic' | 'Purchase';
}