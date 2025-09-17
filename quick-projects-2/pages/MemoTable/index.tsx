import AppNav from '@/components/AppNav';
import MemoFast from '@/components/MemoTable/MemoFast';
import MemoSlow from '@/components/MemoTable/MemoSlow';
import { Button, Divider, Tabs, TabsProps } from 'antd';
import React from 'react';

export default function MemoTable(): React.JSX.Element {

  const tabs: TabsProps['items'] = [
    {
      key: '1',
      label: 'Slow',
      children: <MemoSlow />
    },
    {
      key: '2',
      label: 'Fast',
      children: <MemoFast />
    },
  ];

  return (
    <AppNav name={MemoTable.name}>
      <small>
        Tests from this website: <Button type='link' target='_blank' href='https://www.saltycrane.com/blog/2019/03/how-to-usememo-improve-performance-react-table/'>How to useMemo to improve the performance of a React table
          - Salty Crane Blog</Button>
      </small>
      <Divider />
      <div style={{ backgroundColor: '#222', padding: '10px 25px', borderRadius: 10 }}>
        <Tabs defaultActiveKey="1" items={tabs} />
      </div>
    </AppNav>
  );
}