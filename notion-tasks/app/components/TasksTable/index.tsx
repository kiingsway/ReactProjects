import { IDatabase, INotionPage, IProjectTask, IStatusColors } from '@/interfaces';
import { Input, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import useBoolean from '@/app/services/useBoolean';
import { swrOptions, getColumnsFromDatabases, sorter, plainNotionPages, onlyUnique } from '@/app/services/helpers';
import ClickableSwitch from '../ClickableSwitch';
import ColumnTitle from './ColumnTitle';
import ColumnDate from './ColumnDate';
import { rawText } from '@/app/services/rawText';
import { SelectProperties, StatusProperties } from '@/interfaces/intNotionColumns';
import ColumnSelect from './ColumnSelect';
import TaskModal from './TaskModal';

interface Props {
  databases?: IDatabase[];
}

export default function TasksTable({ databases }: Props): React.JSX.Element {

  const [showCompleted, { set: setShowCompleted }] = useBoolean();
  const [search, setSearch] = React.useState('');
  const [modal, { setTrue: openModal, setFalse: closeModal }] = useBoolean();
  const [selectedTask, selectTask] = React.useState<IProjectTask>();

  const setTask = (newTask: IProjectTask): void => {
    selectTask(newTask);
    openModal();
  };

  const unsetTask = (): void => {
    closeModal();
    selectTask(undefined);
  };

  const dbIds = (databases || []).map(d => d.id);
  const tasksColumns = getColumnsFromDatabases(databases);

  const fetcher = (url: string): Promise<INotionPage[]> => axios.get(url).then(res => res.data);
  const { data, error, isLoading } = useSWR(dbIds.length ? `/api/database-items?dbIds=${dbIds.join(',')}` : null, fetcher, swrOptions);

  const tasks = React.useMemo(() => plainNotionPages(data, tasksColumns), [data, tasksColumns]);

  const colors = (data || []).reduce((acc, item) => {
    const status = (item.properties.Status as StatusProperties)?.status ?? {};
    const select = (item.properties.Prioridade as SelectProperties)?.select ?? {};

    const { color: scolor, name: svalue } = status as { color?: string; name?: string };
    const { color: pcolor, name: pvalue } = select as { color?: string; name?: string };

    const newStatus = { color: scolor ?? '', value: svalue ?? '' };
    const newPrior = { color: pcolor ?? '', value: pvalue ?? '' };

    const isUniqueStatus = !acc.status.some(s => s.color === newStatus.color && s.value === newStatus.value);
    const isUniquePrior = !acc.priorities.some(p => p.color === newPrior.color && p.value === newPrior.value);

    if (newStatus.color && newStatus.value && isUniqueStatus) acc.status.push(newStatus);
    if (newPrior.color && newPrior.value && isUniquePrior) acc.priorities.push(newPrior);

    return acc;
  }, { status: [], priorities: [] } as IStatusColors);


  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      const passesCompletedFilter = showCompleted || task['Status'] !== 'Concluído';
      const passesSearchFilter = !search || Object.values(task).some(val =>
        typeof val === 'string' && rawText(val).includes(search)
      );

      return passesCompletedFilter && passesSearchFilter;
    });
  }, [search, showCompleted, tasks]);

  const uniqueItems: { [key: string]: { text: string, value: string | null }[] } = {
    Status: filteredTasks.map(t => t?.['Status'] ?? null).filter(onlyUnique).sort().map(i => ({ text: i ?? '(vazio)', value: i ?? null })),
    Prazo: filteredTasks.map(t => t?.['Prazo'] ?? null).filter(onlyUnique).sort().map(i => ({ text: i ?? '(vazio)', value: i ?? null })),
    Prioridade: filteredTasks.map(t => t?.['Prioridade'] ?? null).filter(onlyUnique).sort().map(i => ({ text: i ?? '(vazio)', value: i ?? null })),
  };

  const hideColumns = ['Responsável', 'Descrição'];
  const columns: ColumnsType<IProjectTask> = tasksColumns.filter(c => !hideColumns.includes(c.name)).map(col => {

    const render = (value: string | null, item: IProjectTask): React.ReactNode => {

      if (col.type === 'title') return <ColumnTitle value={value} item={item} onClick={() => setTask(item)} />;
      if (col.type === 'date') return <ColumnDate value={value} />;
      if (col.name === 'Status') return <ColumnSelect value={value} color={colors.status.find(c => c.value === value)?.color ?? null} />;
      if (col.name === 'Prioridade') return <ColumnSelect value={value} color={colors.priorities.find(c => c.value === value)?.color ?? null} />;
      return value;
    };

    const filters = uniqueItems[col.name];

    return {
      dataIndex: col.name,
      title: col.name,
      key: col.name,
      render,
      filters,
      filterSearch: Boolean(filters),
      onFilter: (v, r) => r?.[col.name] === v,
      sorter: (a, b) => sorter.alphabetically(a[col.name], b[col.name]),
    };
  });

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-4 items-center p-2 bg-gray-100 rounded-md'>
        <Input placeholder='Search...' value={search} onChange={e => setSearch(e.target.value)} allowClear />
        <ClickableSwitch label='Show Completed' checked={showCompleted} onChange={setShowCompleted} />
      </div>
      {isLoading && <p className='p-4'>Loading all tasks...</p>}
      {error && <p className='p-4'>Error getting all tasks... {String(error)}</p>}
      {data &&
        <Table
          rowKey='id'
          columns={columns}
          dataSource={filteredTasks}
          size='small'
          pagination={{ hideOnSinglePage: true, pageSize: 40 }}
        />}
      <TaskModal open={modal} onClose={unsetTask} task={selectedTask} />

    </div>
  );
}