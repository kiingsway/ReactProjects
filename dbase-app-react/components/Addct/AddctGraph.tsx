import React from "react";
import { Bar } from "react-chartjs-2";
import { format, parseISO } from "date-fns";
import { Page, DateProperties, NumberProperties, RollupProperties, RollupPropertiesRollupArray } from "@/interfaces";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface DataPoint {
  date: string;
  type: string;
  quantity: number;
}

export default function AddctGraph({ data: dataSWR }: { data?: Page[] }): React.JSX.Element {

  const data: DataPoint[] = (dataSWR || [])?.map(convertNotionPageToDataPoint);

  const quantityMap = new Map<string, number>();
  data.forEach(({ type, date, quantity }) => {
    const day = format(parseISO(date), "yyyy-MM-dd");
    const key = `${type}__${day}`;
    quantityMap.set(key, (quantityMap.get(key) || 0) + quantity);
  });

  const types = Array.from(new Set(data.map(d => d.type)));
  const labels = Array.from(new Set(data.map(d => format(parseISO(d.date), "yyyy-MM-dd")))).sort();

  const datasets = types.map((type, index) => {
    const color = typeColors?.[type as keyof typeof typeColors] || `hsl(${(index * 60) % 360}, 70%, 60%)`;
    return {
      label: type,
      data: labels.map(date => quantityMap.get(`${type}__${date}`) || 0),
      backgroundColor: color,
      borderRadius: 4,
    };
  });

  return <Bar data={{ labels, datasets }} options={options} />;
}

const options = {
  responsive: true,
  plugins: { legend: { position: "top" as const } },
  scales: {
    x: { stacked: true, },
    y: { stacked: true, beginAtZero: true },
  },
};

function convertNotionPageToDataPoint(page: Page): DataPoint {
  const date = (page.properties?.Data as DateProperties)?.date?.start ?? "";
  const quantity = (page.properties?.Quantity as NumberProperties)?.number ?? 0;

  const rollupArray = (page.properties?.["Type (Title)"] as RollupProperties)?.rollup?.array ?? [];
  const type = rollupArray
    .map((item: RollupPropertiesRollupArray) => item?.title?.[0]?.plain_text)
    .filter((t: string | undefined) => !!t)
    .join(", ");

  return { date, type, quantity };
}

export const typeColors = {
  F1: "#4CAF50",
  A1: "#FFEB3B",
  PhHs: "#2196F3",
  B1: "#F44336",
};