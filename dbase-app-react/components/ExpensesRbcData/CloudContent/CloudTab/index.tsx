import ColValue from "@/components/ColumnRenderers/ColValue";
import IconText from "@/components/IconText";
import { Table, Button, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { GiPayMoney } from "react-icons/gi";
import { PiGear } from "react-icons/pi";
import { RenderKey } from "../../convertToExpenses/hashIRItem";
import { sorter, renderDate } from "../../helpers";
import { IExpenseItem } from "../../interfaces";
import { IUseDatabaseItems } from "../hooks/useDatabaseItems";

interface Props {
  patProps: IUseDatabaseItems;
}

export default function CloudTab({ }: Props): React.JSX.Element {

  const columns: ColumnsType<IExpenseItem> = [
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
  return (
    <div className="flex flex-col gap-4">
      <Toolbar />
      <Table
        size="small"
        columns={columns}
        dataSource={[]}
        pagination={{
          pageSizeOptions: [50, 100],
          hideOnSinglePage: true,
          defaultPageSize: 50
        }}
      />
    </div>
  );
}

const Toolbar = (): React.JSX.Element => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-start">
        <Button type="primary"><IconText text="Create Expense" icon={<GiPayMoney />} /></Button>
      </div>
      <div className="flex flex-row items-center justify-end">
        <Tooltip title="Opções: Show/Hide Columns, ">
          <Button ><IconText text="Settings" icon={<PiGear />} /></Button>
        </Tooltip>
      </div>
    </div>
  );
};