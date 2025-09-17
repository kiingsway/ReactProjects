import React from "react";
import { IExpenseItem, ITab } from "../interfaces";
import { Button, DatePicker, Table, Tabs } from "antd";
import { sorter } from "../helpers";
import dayjs from "dayjs";
import { InflowPieChart } from "./InflowPieChart";
import ExpenseFormModal from "@/components/ExpensesRbcData/ExpenseFormModal";
import { ColumnsType } from "antd/es/table";
import ColTitle from "@/components/ColumnRenderers/ColTitle";
import ColValue from "@/components/ColumnRenderers/ColValue";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import ClickableSwitch from "@/components/ClickableSwitch";
import useBoolean from "@/hooks/useBoolean";

interface Props {
  expenses: IExpenseItem[];
}

interface IGroupedCategory {
  key: string;
  Category: string;
  Total: number;
}

const dateFormat = "YYYY-MM-DD";

export default function MonthlyGraph({ expenses }: Props): React.JSX.Element {

  const [selectedDate, selectDate] = React.useState(dayjs());
  const [selectedItem, selectItem] = React.useState<IExpenseItem>();
  const [groupedCats, { set: setGroupedCats }] = useBoolean();

  const noExpenses = !expenses || !expenses.length;

  const [minDate, maxDate] = React.useMemo(() => {
    if (noExpenses) return [dayjs(), dayjs()];
    const sortedExpenses = expenses.sort((a, b) => sorter.alphabetically(a.TransactionDate, b.TransactionDate));
    const minDate = sortedExpenses[0].TransactionDate;
    const maxDate = sortedExpenses[sortedExpenses.length - 1].TransactionDate;
    return [dayjs(minDate, dateFormat), dayjs(maxDate, dateFormat)];
  }, [expenses, noExpenses]);

  const filteredExpenses = React.useMemo(() => {
    const inflow: IExpenseItem[] = [];
    const outflow: IExpenseItem[] = [];

    const targetMonth = selectedDate.format("YYYY-MM");

    for (const expense of expenses) {
      if (expense.TransactionDate.includes(targetMonth)) {
        if (expense.Total > 0) inflow.push(expense);
        else outflow.push(expense);
      }
    }

    return { inflow, outflow };
  }, [expenses, selectedDate]);

  const filteredGroupedCategories = React.useMemo(() => {
    const targetMonth = selectedDate.format("YYYY-MM");

    const groupMap = new Map<string, number>();

    for (const expense of expenses) {
      if (!expense.TransactionDate.includes(targetMonth)) continue;

      const Category = [expense.Category, expense.Subcategory].filter(Boolean).join(" ") || "No category";
      const previous = groupMap.get(Category) || 0;

      groupMap.set(Category, previous + expense.Total);
    }

    const inflow: IGroupedCategory[] = [];
    const outflow: IGroupedCategory[] = [];

    for (const [Category, Total] of Array.from(groupMap.entries())) {
      const item = { key: Category, Category, Total };
      if (Total > 0) inflow.push(item);
      else outflow.push(item);
    }

    return { inflow, outflow };
  }, [expenses, selectedDate]);

  const getFullCategory = (item: IExpenseItem, noCatText = "No category"): string => {
    return [item.Category, item.Subcategory].filter(Boolean).join(" ") || noCatText;
  };


  const columns: ColumnsType<IExpenseItem> = [
    {
      dataIndex: "Title", title: "Title",
      sorter: (a, b) => sorter.alphabetically(a.Title, b.Title),
      render: (_, item) => <ColTitle expense={item} onClick={() => selectItem(item)} />,
    },
    {
      title: "Full Category",
      sorter: (a, b) => sorter.alphabetically(getFullCategory(a, ""), getFullCategory(b, "")),
      render: (_, item) => getFullCategory(item, ""),
    },
    {
      dataIndex: "Total", title: "Total",
      sorter: (a, b) => sorter.numerically(a.Total, b.Total),
      render: (_, item) => <ColValue total={item.Total} />
    },
  ];

  const groupedCatsColumns: ColumnsType<IGroupedCategory> = [
    {
      dataIndex: "Category", title: "Category",
      sorter: (a, b) => sorter.alphabetically(a.Category, b.Category),
      render: c => c === "No category" ? "" : c
    },
    {
      dataIndex: "Total", title: "Total",
      sorter: (a, b) => sorter.numerically(a.Total, b.Total),
      render: (_, item) => <ColValue total={item.Total} />
    },
  ];

  const InFlowTable = (): React.JSX.Element => {

    if (groupedCats) {
      return (
        <Table<IGroupedCategory>
          rowKey="key"
          size="small"
          pagination={{ hideOnSinglePage: true }}
          dataSource={filteredGroupedCategories.inflow}
          columns={groupedCatsColumns}
        />
      );
    } else {
      return (
        <Table<IExpenseItem>
          rowKey="key"
          size="small"
          pagination={{ hideOnSinglePage: true }}
          dataSource={filteredExpenses.inflow}
          columns={columns}
        />
      );
    }
  };

  const OutFlowTable = (): React.JSX.Element => {

    if (groupedCats) {
      return (
        <Table<IGroupedCategory>
          rowKey="key"
          size="small"
          pagination={{ hideOnSinglePage: true }}
          dataSource={filteredGroupedCategories.outflow}
          columns={groupedCatsColumns}
        />
      );
    } else {
      return (
        <Table<IExpenseItem>
          rowKey="key"
          size="small"
          pagination={{ hideOnSinglePage: true }}
          dataSource={filteredExpenses.outflow}
          columns={columns}
        />
      );
    }
  };

  const tabs: ITab[] = [
    {
      key: "Inflow", label: "Inflow",
      children: (
        <div className="flex gap-2">
          <InFlowTable />
          <InflowPieChart data={filteredExpenses.inflow} />
        </div>
      )
    },
    {
      key: "Outflow", label: "Outflow",
      children: (
        <div className="flex gap-2">
          <OutFlowTable />
          <InflowPieChart data={filteredExpenses.outflow} />
        </div>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-4">

      <ExpenseFormModal
        open={Boolean(selectedItem)}
        expense={selectedItem}
        onCancel={() => selectItem(undefined)} />

      <div className="flex flex-row gap-4 items-center justify-center">
        <Button
          icon={<IoChevronBackOutline />}
          onClick={() => selectDate(prev => prev.subtract(1, "month"))}
        />
        <DatePicker
          disabled={noExpenses}
          value={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          onChange={date => date && selectDate(date)}
          allowClear={false}
          format="MMMM YYYY"
          picker="month"
        />
        <Button
          icon={<IoChevronForward />}
          onClick={() => selectDate(prev => prev.add(1, "month"))}
        />
      </div>
      <div className="flex flex-row gap-4 items-center justify-center">
        <ClickableSwitch
          checked={groupedCats}
          onChange={setGroupedCats}
          label="Group by Categories" />
      </div>
      <Tabs items={tabs} type="card" />
    </div>
  );
}