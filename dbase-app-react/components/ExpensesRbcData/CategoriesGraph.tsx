/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { Select } from "antd";
import { sorter } from "./helpers";
import { IExpenseItem } from "./interfaces";

interface Props {
  expenses: IExpenseItem[];
}

const ALLCTG = "All Categories";

export default function CategoriesGraph({ expenses }: Props): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState(ALLCTG);

  const months = Array.from(new Set(expenses.map(e => e.TransactionMonth)));
  const fullCategories = Array.from(new Set(expenses.map(e => `${e.Category} ${e.Subcategory}`))).sort();

  const grouped: Record<string, Record<string, number>> = {};
  for (const item of expenses) {
    const label = `${item.Category} ${item.Subcategory}`;
    const month = item.TransactionMonth;

    if (selectedCategory !== ALLCTG && label !== selectedCategory) continue;

    if (!grouped[label]) grouped[label] = {};
    grouped[label][month] = (grouped[label][month] || 0) + item.Total;
  }

  const chartData = Object.entries(grouped).map(([label, values]) => ({ label, ...values, }));

  const handleLegendClick = (data: any): void => setSelectedCategory(data.value);

  return (
    <div style={{ width: "100%", height: 600 }}>
      <Select
        style={{ width: 300, marginBottom: 16 }}
        value={selectedCategory}
        onChange={setSelectedCategory}
        options={[
          { label: ALLCTG, value: ALLCTG },
          ...fullCategories.map(c => ({ label: c, value: c }))
        ]}
      />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip content={p => <CustomTooltip {...p} />} wrapperStyle={{ zIndex: 1000 }} />
          <Legend onClick={handleLegendClick} />
          {months.map(month => (
            <Bar
              key={month}
              dataKey={month}
              fill={getColorFromString(month)}
              label={<CustomBarLabel showValue={selectedCategory !== ALLCTG} />}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CustomTooltipProps {
  active: boolean;
  payload: any[];
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps): React.JSX.Element => {
  if (!active || !payload || !payload.length) return <></>;

  const sortedPayload = payload.sort((a, b) => sorter.alphabetically(a.name, b.name));

  return (
    <div
      style={{
        background: "#333",
        borderRadius: 8,
        padding: "10px",
        zIndex: 9999,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      <strong style={{ color: "#DDD" }}>{label}</strong>
      <br />
      {sortedPayload.map((entry, index) => (
        <div key={index}>
          <span style={{ color: entry.color }}>{entry.name}:</span>{" "}
          <strong style={{ color: "#DDD" }}>{Number(entry.value).toFixed(2)}</strong>
        </div>
      ))}
    </div>
  );
};

function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

const CustomBarLabel = ({ x, y, width, value, showValue }: any): React.JSX.Element => {
  if (value === 0 || value == null || !showValue) return <></>;

  const text = Number(value).toFixed(2);
  const textWidth = text.length * 7; // Estimativa de largura do texto

  return (
    <g transform={`translate(${x + width / 2 - textWidth / 2}, ${y - 24})`}>
      <rect
        x={0}
        y={0}
        width={textWidth + 12}
        height={20}
        fill="#000"
        opacity={0.7}
        rx={8}
        ry={8}
      />
      <text
        x={(textWidth + 12) / 2}
        y={14}
        fill="#fff"
        fontSize={12}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ pointerEvents: "none" }}
      >
        {text}
      </text>
    </g>
  );
};
