import { IProjectTask } from '@/interfaces';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { VscNote } from 'react-icons/vsc';

interface Props {
  value: string | null;
  item: IProjectTask;
  onClick: () => void;
}

export default function ColumnTitle({ item, value, onClick }: Props): React.JSX.Element {

  return (
    <div className='flex items-center gap-4'>
      <Button onClick={onClick} size='small' type='text'>
        <span className='font-medium' style={{ opacity: Boolean(value) ? 1 : 0.3 }}>{value || '(no title)'}</span>
      </Button>
      {item['Descrição'] && (
        <Tooltip title={item['Descrição']}>
          <VscNote />
        </Tooltip>
      )}
    </div>
  );
}