import { Button } from "antd";
import React from "react";
import { PiFileCsvDuotone } from "react-icons/pi";
import { IExpenseItem } from "../interfaces";

interface Props {
  data: IExpenseItem[];
}

export default function DownloadCSVBtn({ data }: Props): React.JSX.Element {

  const filename = `export_${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 17)}.csv`;

  const downloadCSV = (): void => {
    if (!data || data.length === 0) return;

    // Get headers from the first object
    const headers = [
      "Account",
      "AccountType",
      "TransactionDate",
      "TransactionMonth",
      "BankDescription",
      "Title",
      "Category",
      "Subcategory",
      "Balance",
      "Total"
    ];

    // Convert to CSV string
    const csv = [
      headers.join(","), // header row
      ...data.map(row =>
        headers.map(field => {
          const value = row[field as keyof IExpenseItem] ?? "";
          const escaped = String(value).replace(/"/g, "\"\"");
          return `"${escaped}"`; // wrap in quotes
        }).join(",")
      )
    ].join("\r\n");

    // Create and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <Button onClick={downloadCSV} icon={<PiFileCsvDuotone />} />;
}