import { IDatabase } from '@/interfaces';
import { Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { DateTime } from 'luxon';
import { FaKey } from 'react-icons/fa';
import { VscNote } from 'react-icons/vsc';

interface Props {
  databases?: IDatabase[];
}

export default function DataTable({ databases }: Props): React.JSX.Element {

  const columns: ColumnsType<IDatabase> = [
    { key: 'id', dataIndex: 'id', title: 'ID', render: renderId },
    { key: 'title', dataIndex: 'title', title: 'Database', render: (_, db) => renderTitle(db) },
    { key: 'created_time', dataIndex: 'created_time', title: 'Created', render: renderDate },
    { key: 'last_edited_time', dataIndex: 'last_edited_time', title: 'Modified', render: renderDate },
  ];

  return (
    <Table
      rowKey='id'
      columns={columns}
      dataSource={databases}
      size='small'
      pagination={{
        hideOnSinglePage: true,
        pageSize: 15
      }}
    />
  );
}


export function renderDate(isoDate: string): string {
  return DateTime.fromISO(isoDate, { zone: 'utc' }).toFormat('dd/LL/yyyy HH:mm');
}

const renderId = (id: string): React.JSX.Element => (
  <Tooltip title={id}>
    <FaKey />
  </Tooltip>
);

const renderTitle = (db: IDatabase): React.JSX.Element => (
  <div className='flex items-center gap-4'>
    <b>{db.title}</b>
    {db.description && (
      <Tooltip title={db.description}>
        <VscNote />
      </Tooltip>
    )}
  </div>
);