import ClickableSwitch from "@/components/ClickableSwitch";
import { Tag } from "antd";
import React from "react";
import DownloadCSVBtn from "../components/DownloadCSVBtn";
import { IExpenseItem } from "../interfaces";
import SendToNotionBtn from "../components/SendToNotionBtn";

interface Props {
  expenses: IExpenseItem[];
  hideColumns: boolean;
  hideFilledCatg: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowCols: (checked: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setShowFilledCatg: (checked: boolean) => void;
}

export default function TableToolbar({ expenses, hideColumns, setShowCols, hideFilledCatg, setShowFilledCatg, }: Props): React.JSX.Element {

  const filledTitles = expenses.filter(e => Boolean(e.Title)).length;
  const filledCategories = expenses.filter(e => Boolean(e.Category)).length;

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <ClickableSwitch label="Hide some columns" checked={hideColumns} onChange={setShowCols} />
        <ClickableSwitch label="No Category Only" checked={hideFilledCatg} onChange={setShowFilledCatg} />
      </div>
      <div className="flex gap-1 items-center">
        <Tag>Filled Titles: {filledTitles} / {expenses.length}</Tag>
        <Tag>Filled Categories: {filledCategories} / {expenses.length}</Tag>
        <DownloadCSVBtn data={expenses} />
        <SendToNotionBtn />
      </div>
    </div>
  );
}