import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { IExpenseBankItem, IExpenseDataItem } from './interfaces';
import { sorter } from '@/services/helpers';
import ColumnKey from './ColumnKey';
import { FaFileCsv } from 'react-icons/fa';
import IconText from '../Elements/IconText';
import { DateTime } from 'luxon';
import { guessData } from '../expenses/conversion/convertToExpenses';
import TagWall from './TagWall';
import ClickableSwitch from '../Elements/ClickableSwitch';
import useBoolean from '@/hooks/useBoolean';

interface Props {
  data: IExpenseDataItem[];
}

export default function TableData({ data }: Props): React.JSX.Element {

  const dataSource = dataToBank(data);
  const categories = Array.from(new Set(dataSource.map(i => i.category))).sort().filter(Boolean) as string[];

  const [showingAllCols, { set: setShowCols }] = useBoolean();
  const [selectedRowKeys, selectRowKeys] = React.useState<React.Key[]>(dataSource.map(d => d.key));

  const colsToHide = ["key", "payment", "number", "payee"];
  const columns: ColumnsType<IExpenseBankItem> = [
    {
      title: "key", dataIndex: "key", key: "key",
      render: key => <ColumnKey keyText={key} />,
      sorter: (a, b) => sorter.alphabetically(a.key, b.key)
    },
    { title: "date", dataIndex: "date", key: "date", },
    { title: "payment", dataIndex: "payment", key: "payment", },
    { title: "number", dataIndex: "number", key: "number", },
    { title: "payee", dataIndex: "payee", key: "payee", },
    { title: "memo", dataIndex: "memo", key: "memo", },
    { title: "amount", dataIndex: "amount", key: "amount", },
    {
      title: "category", dataIndex: "category", key: "category",
      sorter: (a, b) => sorter.alphabetically(a.category, b.category)
    },
    { title: "tags", dataIndex: "tags", key: "tags", },
  ];

  const filteredColumns = showingAllCols ? columns : columns.filter(c => !colsToHide.includes(c.title as string))

  const rowClassName = (record: IExpenseBankItem) => {

    const classes = {
      checked: "bg-grey-100",
      unchecked: "bg-red-900 text-white"
    };

    return selectedRowKeys.includes(record.key) ?
      classes.checked :
      classes.unchecked;
  };

  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='bg-gray-100 p-4 rounded-lg' style={{
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center'
      }}>
        <ClickableSwitch
          onChange={setShowCols}
          label="Show all columns" />
        <Button type='primary' onClick={() => downloadHomebankCSV(dataSource, selectedRowKeys)}>
          <IconText text='Download Homebank CSV' icon={<FaFileCsv />} />
        </Button>
      </div>
      <TagWall categories={categories} />
      <div className='w-full'>
        <Table
          size='small'
          rowKey="key"
          rowClassName={rowClassName}
          columns={filteredColumns}
          dataSource={dataSource}
          pagination={{ pageSize: 15 }}
          rowSelection={{
            selectedRowKeys,
            onChange: selectRowKeys,
          }}
        />
      </div>
    </div>
  );
}

function convertExpensesToCSV(data: IExpenseBankItem[], sep = ";"): string {
  const headers = ["date", "payment", "number", "payee", "memo", "amount", "category", "tags"];
  const rows = data.map(item => {
    return [
      item.date, "", "", "", item.memo, item.amount, item.category, ""
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(sep);
  });
  return [headers.map(h => `"${h}"`).join(sep), ...rows].join("\n");
}

function downloadHomebankCSV(d: IExpenseBankItem[], selectedRowKeys: React.Key[]) {
  const data = d.filter(d => selectedRowKeys.includes(d.key))
  const csvData = convertExpensesToCSV(data);
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `expenses-${DateTime.now().toISO()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const dataToBank = (data: IExpenseDataItem[]): IExpenseBankItem[] => {

  return data.map(({ key, Title, Total, TransactionDate }) => {

    const { Category, Subcategory } = guessData({
      key,
      AccountType: "",
      Balance: 0,
      Description1: Title,
      Description2: "",
      Total,
      TransactionDate
    });

    const category = [Category?.name, Subcategory?.name].filter(Boolean).join(":");

    return {
      key,
      date: DateTime.fromISO(TransactionDate).toFormat("yy-LL-dd"),
      memo: Title,
      amount: Total.toFixed(2),
      category
    };
  });
}