import React from 'react';
import { handleExpenseColumns } from '../ColumnsRender/expenseColumns';
import { Alert, Button, Table, Tooltip } from 'antd';
import { TbPigMoney } from 'react-icons/tb';
import IconText from '../Elements/IconText';
import { ICategoryItem, IExpenseItem } from '@/interfaces';
import useBoolean from '@/hooks/useBoolean';
import ExpenseFormModal from './ExpenseFormModal';
import { rawText } from '@/services/helpers';
import { BsArrowClockwise } from 'react-icons/bs';

interface Props {
  expenses: IExpenseItem[];
  updateExpenses: () => void;
  search: string;
  isLoading: boolean;
  isValidating: boolean;
  errors: string[];
  categories: ICategoryItem[];
}

export default function CloudExpenses({ search, expenses, categories, errors, isLoading, isValidating, updateExpenses }: Props): React.JSX.Element {

  const [selectedExpense, selectExpense] = React.useState<IExpenseItem>();
  const [openedModal, { setTrue: openModal, setFalse: closeModal }] = useBoolean();

  const setExpense = (item?: IExpenseItem): void => {
    selectExpense(item);
    openModal();
  };

  const unsetExpense = (): void => {
    selectExpense(undefined);
    closeModal();
  };

  const filteredExpenses = React.useMemo(() => {
    const s = rawText(search);
    return expenses.filter(expense => {
      return expense.AccountType.includes(s) ||
        expense.TransactionDate.includes(s) ||
        expense.BankDescription.includes(s) ||
        expense.Description.includes(s)
    });
  }, [expenses, search]);

  return (
    <div className='flex flex-col gap-4 w-full'>

      <Toolbar
        updateData={updateExpenses}
        errors={errors}
        isLoading={isLoading}
        onCreateClick={() => setExpense(undefined)}
      />

      <Table
        rowKey="id"
        size="small"
        loading={isValidating}
        columns={handleExpenseColumns(setExpense)}
        dataSource={filteredExpenses}
        pagination={{
          pageSizeOptions: [50, 100],
          hideOnSinglePage: true,
          defaultPageSize: 50
        }}
      />

      <ExpenseFormModal
        open={openedModal}
        expense={selectedExpense}
        updateData={updateExpenses}
        onClose={unsetExpense}
        allCategories={categories}
      />

    </div>
  );
}



interface ToolbarProps {
  onCreateClick?: () => void;
  updateData: () => void;
  errors?: string[];
  isLoading?: boolean;
}

const Toolbar = ({ errors, updateData, isLoading, onCreateClick }: ToolbarProps): React.JSX.Element => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2 justify-start">
        <Button
          onClick={onCreateClick}
          type="primary"
          disabled={isLoading}>
          <IconText text="Create Expense" icon={<TbPigMoney />} />
        </Button>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <Tooltip title="Update data">
          <Button
            onClick={updateData}
            type="text"
            loading={isLoading}
            disabled={isLoading}>
            <IconText icon={<BsArrowClockwise />} />
          </Button>
        </Tooltip>
      </div>
    </div>
    {(errors || []).map(e => <Alert key={e} message={e} type="error" closable />)}
  </div>
);