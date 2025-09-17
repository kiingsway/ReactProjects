import React from "react";
import useBoolean from "@/hooks/useBoolean";
import { IExpenseItem } from "../interfaces";
import TableToolbar from "./TableToolbar";
import handleTableColumns from "./handleTableColumns";
import ExpenseFormTable from "./ExpenseFormTable";

interface Props {
  expenses: IExpenseItem[]
}

export default function ExpensesTable({ expenses }: Props): React.JSX.Element {

  // const [expenseFormItems, setExpenseFormItems] = React.useState<IExpenseItem[]>(expenses);
  const [hideColumns, { set: setShowCols }] = useBoolean(true);
  const [hideFilledCatg, { set: setShowFilledCatg }] = useBoolean();

  const columns = React.useMemo(() => handleTableColumns(hideColumns), [hideColumns]);

  const filteredExpenses = React.useMemo(() => {
    if (hideFilledCatg) return expenses.filter(e => !e.Category || e.Category.trim() === "");
    return expenses;
  }, [hideFilledCatg, expenses]);

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        expenses={expenses}
        hideColumns={hideColumns}
        hideFilledCatg={hideFilledCatg}
        setShowCols={setShowCols}
        setShowFilledCatg={setShowFilledCatg} />
        
      <ExpenseFormTable
        dataSource={filteredExpenses}
        columns={columns} />
    </div>
  );
}



