import { Button } from 'antd';
import React from 'react';
import { MdUpdate } from 'react-icons/md';

export default function Toolbar(): React.JSX.Element {
  return (
    <div style={{ padding: 10, display: 'flex', gap: 15, justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: 15 }}>
        <Button type='primary'>New Item</Button>
        <Button type='primary'>New Type</Button>
      </div>
      <Button type='primary' icon={<MdUpdate />} />
    </div>
  );
}