import React from "react";
import { Input, Tabs } from "antd";
import AppsFrame from "@/components/AppsFrame";
import AddJsonModal from "@/components/ExpensesRbcData/AddJsonModal";
import { IRbcItem } from "@/components/ExpensesRbcData/interfaces";
import ItemsTable from "@/components/ExpensesRbcData/ItemsTable";
import ExpensesTable from "@/components/ExpensesRbcData/ExpensesTable";
import convertToExpenses from "@/components/ExpensesRbcData/convertToExpenses";
import ExpensesGraph from "@/components/ExpensesRbcData/ExpensesGraph";
import { rawText } from "@/app/services/helpers";
import BalanceGraph from "@/components/ExpensesRbcData/BalanceGraph";
import CategoriesGraph from "@/components/ExpensesRbcData/CategoriesGraph";

/**
 * Tarefas:
 * - Adicionar itens no Notion (antes verificar exclusividade dos itens)
 * - Edição no formulário (antes de enviar para o Notion)
 */

export default function ExpensesRbcData(): React.JSX.Element {

  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState<IRbcItem[]>();

  const filteredData = React.useMemo(() => {
    if (!data || !search) return data || [];
    const s = rawText(search);
    return data.filter(d =>
      rawText(d.Description1).includes(s) ||
      rawText(d.Description2).includes(s)
    );
  }, [data, search]);

  const expenses = React.useMemo(() => convertToExpenses(data || []), [data]);

  const filteredExpenses = React.useMemo(() => {
    if (!expenses || !search) return expenses || [];
    const s = rawText(search);
    return expenses.filter(d =>
      rawText(d.BankDescription).includes(s) ||
      rawText(d.Title).includes(s) ||
      rawText(d.Category + " " + d.Subcategory).includes(s)
    );
  }, [expenses, search]);

  const tabs = [
    { key: "rbc", label: "RBC Data", children: <ItemsTable data={filteredData} /> },
    { key: "exs", label: "Expenses Data", children: <ExpensesTable expenses={filteredExpenses} /> },
    { key: "grp", label: "Expenses Graph", children: <ExpensesGraph expenses={filteredExpenses} /> },
    { key: "blg", label: "Balance Graph", children: <BalanceGraph expenses={filteredExpenses} /> },
    { key: "ctg", label: "Categories Graph", children: <CategoriesGraph expenses={filteredExpenses} /> },
  ];

  return (
    <AppsFrame>
      <div className="flex gap-4">
        <AddJsonModal onRealData={d => setData(d as IRbcItem[])} />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
      </div>
      <Tabs type="card" items={tabs} />
    </AppsFrame>
  );
}