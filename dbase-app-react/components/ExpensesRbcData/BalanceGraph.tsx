import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { Select } from "antd";
const { Option } = Select;

import { IExpenseItem } from "./interfaces";

interface Props {
  expenses: IExpenseItem[];
}

interface IBalanceExpenseItem {
  Date: string;
  Balance: number;
}

export default function BalanceGraph({ expenses }: Props): React.JSX.Element {
  // Gera os nomes combinados: "Account AccountType"
  const accounts = Array.from(
    new Set(
      expenses.map(e => `${e.Account} ${e.AccountType}`)
    )
  );

  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

  // Filtra despesas do account selecionado
  const filtered = expenses.filter(
    e => `${e.Account} ${e.AccountType}` === selectedAccount
  );

  // Agrupa por Date e Balance únicos
  const uniqueBalanceExpenses: IBalanceExpenseItem[] = filtered.reduce<IBalanceExpenseItem[]>((acc, curr) => {
    const exists = acc.some(i => i.Date === curr.TransactionDate && i.Balance === curr.Balance);
    if (!exists) acc.push({ Date: curr.TransactionDate, Balance: curr.Balance });
    return acc;
  }, []);

  // Ordena por data
  uniqueBalanceExpenses.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={selectedAccount}
        onChange={setSelectedAccount}
        style={{ width: 300 }}
      >
        {accounts.map(acc => (
          <Option key={acc} value={acc}>
            {acc}
          </Option>
        ))}
      </Select>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={uniqueBalanceExpenses}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Balance"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
