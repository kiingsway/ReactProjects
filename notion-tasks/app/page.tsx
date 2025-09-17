'use client';
import React from 'react';
import DataTable from './components/DataTable';
import '@ant-design/v5-patch-for-react-19';
import { Tabs } from 'antd';
import TasksTable from './components/TasksTable';
import axios from 'axios';
import { IDatabase, INotionDatabase } from '@/interfaces';
import { plainNotionData, swrOptions } from './services/helpers';
import useSWR from 'swr';
import { Alert } from 'antd';

export default function Home(): React.JSX.Element {

  const fetcher = (url: string): Promise<IDatabase[]> => axios.get(url).then((res: { data: INotionDatabase[]; }) => plainNotionData(res.data));
  const { data: databases, error, isLoading } = useSWR('/api/databases', fetcher, swrOptions);

  const tabs = [
    {
      key: 'dbs',
      label: 'Databases',
      children: <Alert.ErrorBoundary><DataTable databases={databases} /></Alert.ErrorBoundary>
    },
    {
      key: 'tasks',
      label: 'Tasks',
      children: <Alert.ErrorBoundary><TasksTable databases={databases} /></Alert.ErrorBoundary>
    },
  ];

  const Comp = (): React.JSX.Element => {
    if (isLoading) return <p>Loading...</p>;
    if (error) return (
      <div>
        <p>Failed to load databases</p>
        <p>{String(error)}</p>
      </div>
    );
    return (
      <Tabs
        defaultActiveKey="1"
        type="card"
        size="small"
        style={{ marginBottom: 32 }}
        items={tabs}
      />
    );
  };

  return (
    <div className='p-4'>
      <Comp />
    </div>
  );
}