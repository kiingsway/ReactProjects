import React from "react";
import { IExpenseItem } from "./interfaces";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  expenses: IExpenseItem[];
}

export default function ExpensesGraph({ expenses }: Props): React.JSX.Element {

  const chartData = groupDataByDate(expenses);

  // Encontra todas as combinações Category + Subcategory
  const allLabels = Array.from(
    new Set(expenses.map(d => `${d.Category} ${d.Subcategory}`))
  );

  const colorMap: Record<string, string> = {};
  for (const label of allLabels) {
    colorMap[label] = getRandomColor();
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {allLabels.map(label => (
          <Bar key={label} dataKey={label} stackId="a" fill={colorMap[label]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// Agrupa os dados por TransactionDate
function groupDataByDate(items: IExpenseItem[]): { date: string }[] {
  const grouped: Record<string, Record<string, number>> = {};

  for (const item of items) {
    const key = item.TransactionMonth; // 👈 Agrupar por mês (ex: "June")
    const label = `${item.Category} ${item.Subcategory}`;

    if (!grouped[key]) grouped[key] = {};
    grouped[key][label] = (grouped[key][label] || 0) + item.Total;
  }

  return Object.entries(grouped).map(([date, values]) => ({
    date,
    ...values,
  }));
}

function getRandomColor(): string {
  // Ex: "#a3e4d7"
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}
