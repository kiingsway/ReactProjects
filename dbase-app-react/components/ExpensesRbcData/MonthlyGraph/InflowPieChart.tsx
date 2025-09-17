import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export interface IExpenseBase {
  key: string;
  Account: string;
  AccountType: string;
  BankDescription: string;
  Title: string;
  Balance: number;
  Total: number;
  TransactionMonth: string;
  Category?: string;
  Subcategory?: string;
}

export interface IExpenseItem extends IExpenseBase {
  TransactionDate: string;
}

interface Props {
  data: IExpenseItem[];
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#AF19FF", "#FF6666", "#339933", "#FFCC00"
];

export const InflowPieChart: React.FC<Props> = ({ data }) => {
  const pieData = React.useMemo(() => {
    const grouped = data
      .filter(item => item.Total !== 0)
      .reduce<Record<string, number>>((acc, item) => {
        const key = `${item.Category ?? "No category"} ${item.Subcategory ?? ""}`.trim();
        acc[key] = (acc[key] || 0) + Math.abs(item.Total);
        return acc;
      }, {});

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)), // <- formata com 2 casas decimais
    }));
  }, [data]);

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={140}
        label={({ name, value }) => `${name}: $${value ? value.toFixed(2) : "-"}`} // <- label no gráfico
      >
        {pieData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number) => `$${value.toFixed(2)}`} // <- tooltip formatado
      />
      <Legend />
    </PieChart>
  );
};
