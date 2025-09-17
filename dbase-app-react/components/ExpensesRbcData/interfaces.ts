import { Dayjs } from "dayjs";

export interface IRbcItem {
  key: string;
  AccountType: string;
  TransactionDate: string;
  Description1: string;
  Description2: string;
  Balance: number;
  Total: number;
}

export interface IExpenseBase {
  key: string;
  Account: string;
  AccountType: string;
  BankDescription: string;
  Title: string;
  Balance: number;
  Total: number;
  TransactionMonth: string;
  Category?: string;
  Subcategory?: string;
}

export interface IExpenseItem extends IExpenseBase {
  TransactionDate: string;
}

export interface IExpenseFormItem extends IExpenseBase {
  TransactionDate: Dayjs;
}

export interface IConvertExpenseRule {
  match: string;
  Title?: string;
  Category: string;
  Subcategory: string;
}

export interface ITab {
  key: string;
  label: React.ReactNode;
  children: React.JSX.Element;
}