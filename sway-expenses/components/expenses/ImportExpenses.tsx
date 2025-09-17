import { Table, Select, Alert } from 'antd';
import React from 'react';
import { expenseColumns, rbcTableColumns } from '../ColumnsRender/expenseColumns';
import ImportJsonModal from './ImportJsonModal';
import { IExpenseItem, IRbcItem } from '@/interfaces';
import convertToExpenses from './conversion/convertToExpenses';
import { rawText } from '@/services/helpers';
import SendNotionModal from './SendNotionModal';
import { ColumnsType } from 'antd/es/table';
import { TGetCategoryByName } from '@/pages/expenses';
import ExportButton from './ExportButton';

type TViews = "rbc" | "exp";

interface Props {
  addData: (data: unknown[], concat: boolean) => void;
  rbcItems?: IRbcItem[];
  search: string;
  expensesData: IExpenseItem[];
  getCategoryByName: TGetCategoryByName;
  updateExpenses: () => void;
  loading: boolean;
}

export default function ImportExpenses({ loading, rbcItems, search, expensesData, addData, getCategoryByName, updateExpenses }: Props): React.JSX.Element {

  const [view, setView] = React.useState<TViews>('exp');

  const filteredRbcItems = React.useMemo(() => {
    const s = rawText(search);
    return (rbcItems || [])?.filter(i => {
      return rawText(`${i.Description1} ${i.Description2}`).includes(s) || rawText(i.AccountType).includes(s);
    })
  }, [rbcItems, search]);

  const { expenses, filteredExpenses } = React.useMemo(() => {
    const s = rawText(search);
    const expenses = convertToExpenses(rbcItems || []);
    const filteredExpenses = expenses.filter(i => {
      return rawText(i.BankDescription).includes(s) ||
        rawText(`${i.Category} ${i.Subcategory}`).includes(s) ||
        rawText(i.Description).includes(s)
    });
    return { expenses, filteredExpenses };
  }, [rbcItems, search]);

  function ExpenseTable<T>({ columns, dataSource }: { columns: ColumnsType<T>; dataSource: T[] }): React.JSX.Element {
    return (
      <Table<T>
        columns={columns}
        dataSource={dataSource}
        size="small"
        pagination={{
          pageSizeOptions: [50, 100],
          hideOnSinglePage: true,
          defaultPageSize: 50
        }}
      />
    );
  }

  return (
    <div className='flex flex-col gap-4'>

      <Toolbar
        loading={loading}
        expenses={expenses}
        addData={addData}
        dataExists={Boolean(rbcItems && rbcItems.length)}
        selectedView={view}
        onViewChange={setView}
        expensesData={expensesData}
        updateExpenses={updateExpenses}
        getCategoryByName={getCategoryByName}
      />

      {view === "exp" ?
        <ExpenseTable columns={expenseColumns} dataSource={filteredExpenses} /> :
        <ExpenseTable columns={rbcTableColumns} dataSource={filteredRbcItems} />
      }

    </div>
  );
}

interface ToolbarProps {
  expenses: IExpenseItem[];
  error?: string;
  loading: boolean;
  selectedView: TViews;
  dataExists: boolean;
  expensesData: IExpenseItem[]
  onViewChange: (v: TViews) => void;
  addData: (data: unknown[], concat: boolean) => void;
  getCategoryByName: TGetCategoryByName
  updateExpenses: () => void;
}

const Toolbar = ({ expenses, error, loading, selectedView, dataExists, expensesData, onViewChange, addData, getCategoryByName, updateExpenses }: ToolbarProps): React.JSX.Element => (
  <div className="flex flex-col gap-2 w-full">
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2 justify-start">
        <ImportJsonModal onRealData={addData} dataExists={dataExists} buttonDisabled={loading} />
      </div>
      <div className="flex items-center gap-2 justify-end">
        <SendNotionModal
          expensesLoading={loading}
          localExpenses={expenses}
          cloudExpenses={expensesData}
          getCategoryByName={getCategoryByName}
          updateExpenses={updateExpenses}
          btnProps={{ disabled: loading || !dataExists, loading }} />
        <Select
          onChange={e => onViewChange(e as TViews)}
          value={selectedView}
          style={{ width: 150 }}
          options={[
            { value: 'exp', label: 'Expense View' },
            { value: 'rbc', label: 'RBC View' }
          ] as { value: TViews, label: string }[]}
        />
        <ExportButton expenses={expenses} />
      </div>
    </div>
    {error ? <Alert message={String(error)} type="error" /> : <></>}
  </div>
)