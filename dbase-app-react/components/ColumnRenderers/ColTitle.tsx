import React from "react";
import { IExpenseItem } from "../ExpensesRbcData/interfaces";
import { Button } from "antd";

interface Props {
  expense: IExpenseItem;
  onClick: () => void;
}

export default function ColTitle({ expense, onClick }: Props): React.JSX.Element {
  return (
    <Button size="small" type="text" onClick={onClick}>
      {expense.Title || expense.BankDescription}
    </Button>
  );
}