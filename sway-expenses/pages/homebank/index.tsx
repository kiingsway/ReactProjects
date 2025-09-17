/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Input } from 'antd';
import React from 'react';
import { createHash } from 'crypto';
import { IExpenseDataItem } from '@/components/homebank/interfaces';
import TableData from '@/components/homebank/TableData';

/**
 * Botão para adicionar JSON
 * Enquanto adiciona, também fazer a key
 * Se já tiver JSON, concatenar (filtrando key)
 * Inserir Matches
 */

export default function HomeBank(): React.JSX.Element {

  const [tempJsonText, setTempJsonText] = React.useState("");
  const [error, setError] = React.useState("");
  const [data, setData] = React.useState<IExpenseDataItem[]>([]);

  React.useEffect(() => {
    if (!tempJsonText.trim()) {
      setData([]);
      return;
    }

    try {
      setError("");
      const parsed = JSON.parse(tempJsonText);

      if (!Array.isArray(parsed)) throw new Error("JSON precisa ser uma array de objetos");

      const newData = parsed.map((item: any): IExpenseDataItem => {
        const hash = hashSortedObject(item);

        return {
          key: hash,
          Account: "RBC",
          TransactionDate: item.TransactionDate,
          Title: item.BankDescription || "",
          Total: Number(item.Total)
        };
      });

      setData(newData);
    } catch (e) {
      setError(`Failed to parse JSON: ${e}`);
      setData([]);
    }

  }, [tempJsonText]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <Input.TextArea value={tempJsonText} onChange={e => setTempJsonText(e.target.value)} />
      {error && <Alert message={error} type="error" />}
      <TableData data={data} />
    </div >
  );
}

function sortObject(obj: any): any {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return obj;

  const sortedKeys = Object.keys(obj).sort();
  const result: any = {};

  for (const key of sortedKeys) {
    result[key] = sortObject(obj[key]); // ordena recursivamente
  }

  return result;
}

function hashSortedObject(obj: any): string {
  const sorted = sortObject(obj);
  const jsonString = JSON.stringify(sorted);
  return createHash("sha256").update(jsonString).digest("hex");
}