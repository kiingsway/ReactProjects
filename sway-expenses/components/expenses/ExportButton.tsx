import { IExpenseItem } from '@/interfaces';
import { Dropdown, MenuProps } from 'antd';
import React from 'react';
import IconText from '../Elements/IconText';
import { BsFiletypeCsv, BsFiletypeJson } from 'react-icons/bs';

interface Props {
  expenses: IExpenseItem[];
}

export default function ExportButton({ expenses }: Props): React.JSX.Element {

  const onMenuClick: MenuProps['onClick'] = e => {
    console.log('click', e);
  };

  const downloadCsv = (): void => {
    if (!expenses.length) return;

    const replacer = (key: string, value: unknown) =>
      value === null || value === undefined ? "" : value;

    // Extrai os cabeçalhos do primeiro item
    const headers = Object.keys(expenses[0]);

    // Monta as linhas
    const csv = [
      headers.join(","), // primeira linha com os cabeçalhos
      ...expenses.map(row =>
        headers.map(field => {
          const value = replacer(field, (row as any)[field]);
          const escaped = typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
          return escaped;
        }).join(",")
      )
    ].join("\r\n");

    // Cria o blob e dispara o download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadJson = (): void => {
    const json = JSON.stringify(expenses, null, 2); // bonito e legível
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.json";
    link.click();

    // Limpeza
    URL.revokeObjectURL(url);
  };

  const items = [
    {
      key: 'csv',
      label: 'Download CSV',
      icon: <BsFiletypeCsv />,
      onClick: downloadCsv
    }
  ];

  return (
    <Dropdown.Button
      style={{ width: 'unset' }}
      onClick={downloadJson}
      menu={{ onClick: onMenuClick, items }}>
      <IconText icon={<BsFiletypeJson />} text='Download JSON' />
    </Dropdown.Button>
  );
}