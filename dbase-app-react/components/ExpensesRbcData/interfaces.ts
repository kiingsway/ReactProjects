export interface IRbcItem {
  AccountType: string;
  TransactionDate: string;
  Description1: string;
  Description2: string;
  Balance: number;
  Total: number;
}

export interface IExpenseItem {
  Account: string;
  AccountType: string;
  TransactionDate: string;
  BankDescription: string;
  Title: string;
  Balance: number;
  Total: number;

  TransactionMonth: string;
  Category?: string;
  Subcategory?: string;
}

export interface IConvertExpenseRule {
  match: string;
  Title?: string;
  Category: string;
  Subcategory: string;
}