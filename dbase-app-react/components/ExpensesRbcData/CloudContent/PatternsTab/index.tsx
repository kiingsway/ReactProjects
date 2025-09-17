/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { IUseDatabaseItems } from "../hooks/useDatabaseItems";
import Table, { ColumnsType } from "antd/es/table";
import ColumnDate from "../columns/ColumnDate";
import { ICategoryItem, IPatternItem } from "../interfaces";
import IconText from "@/components/IconText";
import { Button, Alert } from "antd";
import { TbRegex } from "react-icons/tb";
import { sorter } from "../../helpers";
import useBoolean from "@/hooks/useBoolean";
import PatternFormModal from "./PatternFormModal";

interface Props {
  patProps: IUseDatabaseItems<IPatternItem>;
  catProps: IUseDatabaseItems<ICategoryItem>;
}

export default function PatternsTab({ catProps, patProps }: Props): React.JSX.Element {

  const { error: caterror, isError: ciserr, isLoading: cisld, items: categories, updateData: updateCategories } = catProps;
  const { error: paterror, isError: piserr, isLoading: pisld, items: patterns, updateData: updatePatterns } = patProps;
  const [selectedPattern, selectPattern] = React.useState<IPatternItem>();
  const [openedModal, { setTrue: openModal, setFalse: closeModal }] = useBoolean();

  const error = [paterror, caterror].join(" ");
  const isError = ciserr || piserr;
  const isLoading = cisld || pisld;

  const setPattern = (pattern?: IPatternItem): void => {
    selectPattern(pattern);
    openModal();
  };

  const unsetPattern = (): void => {
    selectPattern(undefined);
    closeModal();
    updateCategories();
  };

  const columns: ColumnsType<IPatternItem> = [
    {
      title: "Match", dataIndex: "Match", key: "Match",
      sorter: (a, b) => sorter.alphabetically(a.Match, b.Match),
      render: (t, item) => <Button type="text" size="small" onClick={() => setPattern(item)}>{t}</Button>
    },
    {
      title: "Title", dataIndex: "Title", key: "Title",
      sorter: (a, b) => sorter.alphabetically(a.Title, b.Title),
    },
    {
      title: "Category", dataIndex: ["Category", "text"], key: "Category",
      sorter: (a, b) => sorter.alphabetically(a.Category.text, b.Category.text)
    },
    {
      title: "Subcategory", dataIndex: ["Subcategory", "text"], key: "Subcategory",
      sorter: (a, b) => sorter.alphabetically(a.Subcategory.text, b.Subcategory.text)
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

      <PatternFormModal
        open={openedModal}
        allCategories={categories}
        pattern={selectedPattern}
        onClose={unsetPattern}
        updateData={updatePatterns}
      />

      <Toolbar
        onCreateClick={() => setPattern(undefined)}
        error={isError ? String(error) : ""}
        isLoading={isLoading} />

      <Table<IPatternItem>
        rowKey="id"
        dataSource={patterns}
        loading={isLoading}
        size="small"
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />
    </div>
  );
}

interface ToolbarProps {
  onCreateClick: () => void;
  error: string;
  isLoading: boolean;
}

const Toolbar = ({ error, isLoading, onCreateClick }: ToolbarProps): React.JSX.Element => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2 justify-start">
        <Button
          onClick={onCreateClick}
          type="primary"
          loading={isLoading}>
          <IconText text="Create Pattern" icon={<TbRegex />} />
        </Button>
      </div>
      <div className="flex items-center gap-2 justify-end">

      </div>
    </div>
    {error ? <Alert message={String(error)} type="error" /> : <></>}
  </div>
);