export interface IExpenseDataItem {
  key: string;
  Account: "RBC";
  TransactionDate: string;   // Date
  Title: string;
  Total: number;             // Amount
}

export interface IExpenseBankItem {
  key: string;
  date: string;
  payment?: string;
  number?: string;
  payee?: string;
  memo: string;
  amount: string;
  category?: string;
  tags?: string;
}