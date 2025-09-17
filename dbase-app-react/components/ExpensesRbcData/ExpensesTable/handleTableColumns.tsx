import React from "react";
import { IExpenseItem, IRbcItem } from "../interfaces";
import { ColumnsType } from "antd/es/table";
import { RenderKey } from "../convertToExpenses/hashIRItem";
import { sorter, renderDate } from "../helpers";
import ColValue from "@/components/ColumnRenderers/ColValue";

export const rbcTableColumns: ColumnsType<IRbcItem> = [
  { dataIndex: "key", key: "key", title: "Key", render: (key: string) => <RenderKey hashKey={key} /> },
  {
    dataIndex: "AccountType", key: "AccountType", title: "Account",
    sorter: (a, b) => sorter.alphabetically(a.AccountType, b.AccountType),
  },
  {
    dataIndex: "TransactionDate", key: "TransactionDate", title: "Date",
    render: renderDate,
    sorter: (a, b) => sorter.alphabetically(a.TransactionDate, b.TransactionDate),
  },
  {
    dataIndex: "Description1", key: "Description1", title: "Description 1",
    sorter: (a, b) => sorter.alphabetically(a.Description1, b.Description1),
  },
  {
    dataIndex: "Description2", key: "Description2", title: "Description 2",
    sorter: (a, b) => sorter.alphabetically(a.Description2, b.Description2),
  },
  {
    dataIndex: "Balance", title: "Balance",
    sorter: (a, b) => sorter.numerically(a.Balance, b.Balance),
    render: (_, item) => <ColValue total={item.Balance} />
  },
  {
    dataIndex: "Total", title: "Total",
    sorter: (a, b) => sorter.numerically(a.Total, b.Total),
    render: (_, item) => <ColValue total={item.Total} />
  },
];

export const expenseTableColumns: ColumnsType<IExpenseItem> = [
  { dataIndex: "key", key: "key", title: "Key", render: (key: string) => <RenderKey hashKey={key} /> },
  { dataIndex: "Account", title: "Account" },
  { dataIndex: "AccountType", title: "Account Type" },
  {
    dataIndex: "TransactionDate", title: "Date",
    sorter: (a, b) => sorter.alphabetically(a.TransactionDate, b.TransactionDate),
    render: renderDate
  },
  { dataIndex: "TransactionMonth", title: "Month" },
  {
    dataIndex: "BankDescription", title: "Bank Description",
    sorter: (a, b) => sorter.alphabetically(a.BankDescription, b.BankDescription),
  },
  {
    dataIndex: "Title", title: "Title",
    sorter: (a, b) => sorter.alphabetically(a.Title, b.Title),
  },
  {
    dataIndex: "Category", title: "Category",
    sorter: (a, b) => sorter.alphabetically(a.Category, b.Category),
  },
  {
    dataIndex: "Subcategory", title: "Subcategory",
    sorter: (a, b) => sorter.alphabetically(a.Subcategory, b.Subcategory),
  },
  {
    dataIndex: "Balance", title: "Balance",
    sorter: (a, b) => sorter.numerically(a.Balance, b.Balance),
    render: (_, item) => <ColValue total={item.Balance} />
  },
  {
    dataIndex: "Total", title: "Total",
    sorter: (a, b) => sorter.numerically(a.Total, b.Total),
    render: (_, item) => <ColValue total={item.Total} />
  },
];

export default function handleTableColumns(hideColumns: boolean): ColumnsType<IExpenseItem> {

  const colsToHide: (keyof IExpenseItem)[] = ["key", "Account", "AccountType", "TransactionMonth", "Balance"];

  if (!hideColumns) return expenseTableColumns;
  return expenseTableColumns.filter(c => "dataIndex" in c && c.dataIndex && !colsToHide.includes(c.dataIndex as keyof IExpenseItem));

}