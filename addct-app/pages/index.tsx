import React from 'react';
import useSWR from 'swr';
import Header from '@/components/pages/Home/Header';
import Toolbar from '@/components/pages/Home/Toolbar';
import Dashboard from '@/components/pages/Dashboard';
import Items from '@/components/pages/Items';
import Types from '@/components/pages/Types';
import { ConfigProvider, Tabs, TabsProps, theme } from 'antd';
import { IAddctItem, IAddctType } from '@/interfaces';
import { getDatabaseItems } from '@/components/scripts/getDatabaseItems';

/**
 * Nesse app controlarei os itens que eu faço, como alongamento, exercícios, patins, b1, f1 e etc.
 */

export default function Home(): React.JSX.Element {

  const { data: addctItems, error: addctError, isLoading: addctLoading, mutate: addctUpdate } = useSWR('/api/get-items', getDatabaseItems<IAddctItem>);
  const { data: addctTypes, error: typesError, isLoading: typesLoading, mutate: typesUpdate } = useSWR('/api/get-types', getDatabaseItems<IAddctType>);

  const updateData = (): void => { addctUpdate(); typesUpdate(); };

  console.log('addctItems', addctItems);
  console.log('addctTypes', addctTypes);



  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Dashboard',
      // children: <Dashboard />,
    },
    {
      key: '2',
      label: 'Items',
      // children: <Items />,
    },
    {
      key: '3',
      label: 'Types',
      // children: <Types />,
    },
  ];

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div>
        {/* <div className='flex flex-col items-center min-h-screen w-800'> */}
        <Header />
        <Toolbar />
        <div style={{ padding: 10, borderRadius: 5 }}>
          <Tabs type='card' defaultActiveKey="2" items={items} />
        </div>
        {/* <HomeApp /> */}
      </div>
    </ConfigProvider>
  );
}

