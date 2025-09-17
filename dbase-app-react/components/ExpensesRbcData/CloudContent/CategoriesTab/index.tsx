import { Alert, Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { ICategoryItem } from "../interfaces";
import { IUseDatabaseItems } from "../hooks/useDatabaseItems";
import IconText from "@/components/IconText";
import { TbCategoryPlus } from "react-icons/tb";
import ColumnDate from "../columns/ColumnDate";

interface Props {
  catProps: IUseDatabaseItems<ICategoryItem>;
}

export default function CategoriesTab({ catProps }: Props): React.JSX.Element {

  const { error, isError, isLoading, isValidating, items } = catProps;

  const columns: ColumnsType<ICategoryItem> = [
    { key: "Title", dataIndex: "Title", title: "Title", },
    { key: "Parent", dataIndex: ["Parent", "text"], title: "Parent", },
    {
      key: "Children", dataIndex: ["Children", "text"], title: "Children",
      render: (_, item) => item.Children.map(c => c.text).join(", "),
    },
    {
      key: "created_time", dataIndex: "created_time", title: "Created",
      width: 150,
      render: (date: string) => <ColumnDate date={date} />
    },
    {
      key: "last_edited_time", dataIndex: "last_edited_time", title: "Modified",
      width: 150,
      render: (date: string) => <ColumnDate date={date} />
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Toolbar
        error={isError ? String(error) : ""}
        isValidating={isValidating}
        isLoading={isLoading} />
      <Table
        rowKey="id"
        dataSource={items}
        loading={isLoading}
        size="small"
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />
    </div>
  );
}

interface ToolbarProps {
  error: string;
  isValidating: boolean;
  isLoading: boolean;
}

const Toolbar = ({ error, isLoading, isValidating }: ToolbarProps): React.JSX.Element => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2 justify-start">
        <Button
          type="primary"
          disabled
          loading={isValidating || isLoading}>
          <IconText text="Create Category" icon={<TbCategoryPlus />} />
        </Button>
      </div>
      <div className="flex items-center gap-2 justify-end">

      </div>
    </div>
    {error ? <Alert message={String(error)} type="error" /> : <></>}
  </div>
);