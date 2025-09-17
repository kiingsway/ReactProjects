import React from "react";
import { IRbcItem } from "./interfaces";
import { Table } from "antd";
import { rbcTableColumns } from "./ExpensesTable/handleTableColumns";

interface Props {
  data?: IRbcItem[];
}

export default function ItemsTable({ data }: Props): React.JSX.Element {

  return (
    <Table
      size="small"
      columns={rbcTableColumns}
      dataSource={data}
      pagination={{
        pageSizeOptions: [50, 100],
        hideOnSinglePage: true,
        defaultPageSize: 50
      }}
    />
  );
}