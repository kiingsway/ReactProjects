import React from "react";
import { IExpenseItem } from "./interfaces";
import { Table, Tag } from "antd";
import { renderDate, sorter } from "./helpers";
import useBoolean from "@/hooks/useBoolean";
import { ColumnsType } from "antd/es/table";
import ClickableSwitch from "../ClickableSwitch";
import DownloadCSVBtn from "./components/DownloadCSVBtn";

interface Props {
  expenses: IExpenseItem[]
}

export default function ExpensesTable({ expenses }: Props): React.JSX.Element {

  // const [expenseFormItems, setExpenseFormItems] = React.useState<IExpenseItem[]>(expenses);
  const [hideColumns, { set: setShowCols }] = useBoolean(true);
  const [hideFilledCatg, { set: setShowFilledCatg }] = useBoolean();

  const columns = React.useMemo(() => {

    const colsToHide: (keyof IExpenseItem)[] = ["Account", "AccountType", "TransactionMonth", "Balance"];

    const cols: ColumnsType<IExpenseItem> = [
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
      { dataIndex: "Balance", title: "Balance" },
      {
        dataIndex: "Total", title: "Total",
        sorter: (a, b) => sorter.numerically(a.Total, b.Total),
      },
    ];

    if (!hideColumns) return cols;
    return cols.filter(c => "dataIndex" in c && c.dataIndex && !colsToHide.includes(c.dataIndex as keyof IExpenseItem));

  }, [hideColumns]);

  const filledTitles = expenses.filter(e => Boolean(e.Title)).length;
  const filledCategories = expenses.filter(e => Boolean(e.Category)).length;

  const filteredExpenses = React.useMemo(() => {
    if (hideFilledCatg) return expenses.filter(e => !e.Category || e.Category.trim() === "");
    return expenses;
  }, [hideFilledCatg, expenses]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <ClickableSwitch label="Hide some columns" checked={hideColumns} onChange={setShowCols} />
          <ClickableSwitch label="No Category Only" checked={hideFilledCatg} onChange={setShowFilledCatg} />
        </div>
        <div>
          <Tag>Filled Titles: {filledTitles} / {expenses.length}</Tag>
          <Tag>Filled Categories: {filledCategories} / {expenses.length}</Tag>
          <DownloadCSVBtn data={expenses} />
        </div>
      </div>
      <Table
        size="small"
        columns={columns}
        dataSource={filteredExpenses}
        pagination={{
          pageSizeOptions: [50, 100],
          hideOnSinglePage: true,
          defaultPageSize: 50
        }}
      />
    </div>
  );
}



