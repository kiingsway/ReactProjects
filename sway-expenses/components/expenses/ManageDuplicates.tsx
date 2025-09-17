import { IExpenseItem } from '@/interfaces';
import { Table, Button, Progress } from 'antd';
import React from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { handleExpenseColumns } from '../ColumnsRender/expenseColumns';
import IconText from '../Elements/IconText';
import axios from 'axios';
import useBoolean from '@/hooks/useBoolean';

interface Props {
  expenses: IExpenseItem[];
  isValidating: boolean;
  updateExpenses: () => void;
}

export default function ManageDuplicates({ expenses, isValidating, updateExpenses }: Props): React.JSX.Element {

  const [loading, { setTrue: startLoad, setFalse: stopLoad }] = useBoolean();
  const duplicateExpenses = expenses.filter((item, _, arr) =>
    arr.filter(i => i.key === item.key).length > 1
  );
  const [progress, setProgress] = React.useState({ c: 0, t: 0 });

  const onDeleteAllDuplicates = async (): Promise<void> => {
    if (isValidating) return;

    const duplicateNewerExpenses = Object.values(
      expenses.reduce((acc, item) => {
        const list = acc[item.key] || [];
        list.push(item);
        acc[item.key] = list;
        return acc;
      }, {} as Record<string, typeof expenses>)
    )
      // Agora temos um array de arrays (cada grupo com mesma key)
      .flatMap(group => {
        if (group.length <= 1) return []; // não é duplicado
        // Ordenar por created_time (mais novo primeiro)
        const sorted = group.sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime());
        return sorted.slice(0, group.length - 1); // ignorar o mais antigo (último da ordenação)
      });

    if (window.confirm(`Are you sure you want to delete ${duplicateNewerExpenses.length} duplicated items?`)) {
      startLoad()
      setProgress({ c: 0, t: duplicateNewerExpenses.length });

      for (const exp of duplicateNewerExpenses) {
        try {
          await axios.delete(`/api/pages/${exp.id}`);
          setProgress(p => ({ ...p, c: p.c + 1 }))
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
          console.error(`Não foi possível excluir o item ${exp.Description || exp.BankDescription}`, err);
        }
      }
      updateExpenses();
      stopLoad();
    }

  };

  return (
    <div className='flex flex-col gap-4 w-full'>
      <Toolbar
        loading={loading}
        progress={Math.ceil((progress.c / progress.t) * 100)}
        onClick={onDeleteAllDuplicates}
        disabled={isValidating || loading || !duplicateExpenses.length}
      />
      <Table
        loading={isValidating}
        rowKey="id"
        size="small"
        columns={handleExpenseColumns()}
        dataSource={duplicateExpenses}
        pagination={{
          pageSizeOptions: [50, 100],
          hideOnSinglePage: true,
          defaultPageSize: 50
        }}
      />
    </div>
  );
}


interface ToolbarProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  progress: number
}

const Toolbar = ({ onClick, progress, disabled, loading }: ToolbarProps): React.JSX.Element => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2 justify-start">
        <Button
          loading={loading}
          disabled={disabled}
          onClick={onClick}
          type="text"
          danger>
          <IconText text="Delete Duplicates" icon={<MdDeleteForever />} />
        </Button>
      </div>
      <div className="flex items-center gap-2 justify-end">
      </div>
    </div>
    <Progress percent={progress} />
  </div>
);