import { IExpenseItem, IRbcItem } from "@/interfaces"
import { sorter, renderDate } from "@/services/helpers"
import { ColumnsType } from "antd/es/table"
import ColKeyRenderer from "./ColKeyRenderer";
import ColMoneyRenderer from "./ColMoneyRenderer";
import { Button } from "antd";
import ColDateRender from "./ColDateRender";

export const expenseColumns: ColumnsType<IExpenseItem> = [
  {
    dataIndex: "key", key: "key", title: "Key",
    sorter: (a, b) => sorter.alphabetically(a.key, b.key),
    render: (key: string) => <ColKeyRenderer hashKey={key} />
  },
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
    dataIndex: "Description", title: "Description",
    sorter: (a, b) => sorter.alphabetically(a.Description, b.Description),
  },
  {
    dataIndex: ["Category", "name"], title: "Category",
    sorter: (a, b) => sorter.alphabetically(a.Category?.name, b.Category?.name),
  },
  {
    dataIndex: ["Subcategory", "name"], title: "Subcategory",
    sorter: (a, b) => sorter.alphabetically(a.Subcategory?.name, b.Subcategory?.name),
  },
  {
    dataIndex: "Balance", title: "Balance",
    sorter: (a, b) => sorter.numerically(a.Balance, b.Balance),
    render: (_, item) => <ColMoneyRenderer total={item.Balance} />
  },
  {
    dataIndex: "Total", title: "Total",
    sorter: (a, b) => sorter.numerically(a.Total, b.Total),
    render: (_, item) => <ColMoneyRenderer total={item.Total} />
  },
];

export const handleExpenseColumns = (onClick?: (item: IExpenseItem) => void): ColumnsType<IExpenseItem> => {
  const onTitleClick = (item: IExpenseItem): void => onClick && item ? onClick(item) : (() => { })();
  const columns: ColumnsType<IExpenseItem> = [
    {
      dataIndex: "key", key: "key", title: "Key",
      sorter: (a, b) => sorter.alphabetically(a.key, b.key),
      render: (key: string) => <ColKeyRenderer hashKey={key} />
    },
    { dataIndex: "Account", title: "Account" },
    { dataIndex: "AccountType", title: "Account Type" },
    {
      dataIndex: "TransactionDate", title: "Date",
      sorter: (a, b) => sorter.alphabetically(a.TransactionDate, b.TransactionDate),
      render: date => <ColDateRender date={date} />
    },
    { dataIndex: "TransactionMonth", title: "Month" },
    {
      dataIndex: "BankDescription", title: "Bank Description",
      sorter: (a, b) => sorter.alphabetically(a.BankDescription, b.BankDescription),
      render: (d, item) => <Button type="text" onClick={() => onTitleClick(item)}>{d}</Button>
    },
    {
      dataIndex: "Description", title: "Description",
      sorter: (a, b) => sorter.alphabetically(a.Description, b.Description),
      render: (d, item) => <Button type="text" onClick={() => onTitleClick(item)}>{d}</Button>
    },
    {
      dataIndex: ["Category", "name"], title: "Category",
      sorter: (a, b) => sorter.alphabetically(a.Category?.name, b.Category?.name),
    },
    {
      dataIndex: ["Subcategory", "name"], title: "Subcategory",
      sorter: (a, b) => sorter.alphabetically(a.Subcategory?.name, b.Subcategory?.name),
    },
    {
      dataIndex: "Balance", title: "Balance",
      sorter: (a, b) => sorter.numerically(a.Balance, b.Balance),
      render: (_, item) => <ColMoneyRenderer total={item.Balance} />
    },
    {
      dataIndex: "Total", title: "Total",
      sorter: (a, b) => sorter.numerically(a.Total, b.Total),
      render: (_, item) => <ColMoneyRenderer total={item.Total} />
    },
    {
      dataIndex: "created_time", title: "Crated",
      sorter: (a, b) => sorter.alphabetically(a.created_time, b.created_time),
      render: d => <ColDateRender date={d} />
    }
  ];

  return columns;
}

export const rbcTableColumns: ColumnsType<IRbcItem> = [
  { dataIndex: "key", key: "key", title: "Key", render: (key: string) => <ColKeyRenderer hashKey={key} /> },
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
    render: (_, item) => <ColMoneyRenderer total={item.Balance} />
  },
  {
    dataIndex: "Total", title: "Total",
    sorter: (a, b) => sorter.numerically(a.Total, b.Total),
    render: (_, item) => <ColMoneyRenderer total={item.Total} />
  },
];