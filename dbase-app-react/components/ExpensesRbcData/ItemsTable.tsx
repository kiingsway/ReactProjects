import React from "react";
import { IRbcItem } from "./interfaces";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { renderDate, sorter } from "./helpers";

interface Props {
  data?: IRbcItem[];
}

export default function ItemsTable({ data }: Props): React.JSX.Element {

  const columns: ColumnsType<IRbcItem> = [
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
      dataIndex: "Total", key: "Total", title: "Total",
      sorter: (a, b) => sorter.numerically(a.Total, b.Total),
    },
    {
      dataIndex: "Balance", key: "Balance", title: "Balance",
      sorter: (a, b) => sorter.numerically(a.Balance, b.Balance),
    },
  ];

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={data}
      pagination={{
        pageSizeOptions: [50, 100],
        hideOnSinglePage: true,
        defaultPageSize: 50
      }}
    />
  );
}