import ConvertExpenseTable from '@/components/getCategories/ConvertExpenseTable';
import CSVCategories from '@/components/getCategories/CSVCategories';
import { Tabs, TabsProps } from 'antd';
import React from 'react';


export default function GetCategories(): React.JSX.Element {

  const [csv, setCsv] = React.useState("");
  const [jsonString, setJsonString] = React.useState("");

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Get Categories',
      children: <CSVCategories csv={csv} setCsv={setCsv} />,
    },
    {
      key: '2',
      label: 'Convert Expense Table',
      children: <ConvertExpenseTable jsonString={jsonString} setJsonString={setJsonString} />,
    },
  ];

  return (
    <Tabs defaultActiveKey="1" items={items} />
  );
}