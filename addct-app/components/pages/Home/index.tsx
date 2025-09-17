import React from 'react';
import { IAddctItem, IAddctType } from '@/interfaces';
import { Button, Input, notification, Table } from 'antd';
import { DateTime } from 'luxon';
import useSWR from 'swr';
import { getDatabaseItems } from '@/components/scripts/getDatabaseItems';

export default function HomeApp(): React.JSX.Element {

  const { data: addctItems, error: addctError, isLoading: addctLoading, mutate: addctUpdate } = useSWR('/api/get-items', getDatabaseItems<IAddctItem>);
  const { data: addctTypes, error: typesError, isLoading: typesLoading, mutate: typesUpdate } = useSWR('/api/get-types', getDatabaseItems<IAddctType>);

  const updateData = (): void => { addctUpdate(); typesUpdate(); };

  console.log('addctItems', addctItems);
  console.log('addctTypes', addctTypes);

  React.useEffect(() => {
    const errors = [addctError, typesError].filter(Boolean);
    errors.forEach(e => {
      const msg = e?.response?.data?.error || String(e);
      notification.error({
        message: 'Erro ao carregar itens',
        description: msg || 'Não foi possível recuperar os dados.',
      });
    });
  }, [addctError, typesError]);

  const columns = [
    { key: 'Title', dataIndex: 'Title', title: 'Title' },
    { key: 'Date', dataIndex: 'Date', title: 'Date', render: (v: string): string => DateTime.fromISO(v).toFormat('dd/LL/yyyy HH:mm') },
    { key: 'Quantity', dataIndex: 'Quantity', title: 'Quantity' },
  ];

  return (
    <div>
      <div className='flex flex=row gap-4 items-center'>
        <Button onClick={updateData}>Atualizar</Button>
        {addctLoading && <small>Loading items...</small>}
        {typesLoading && <small>Loading types...</small>}
        {/* <AddctForm addctTypes={addctTypes} /> */}
      </div>
      <Table columns={columns} dataSource={addctItems} rowKey='id' />
      <Input.TextArea value={JSON.stringify(addctTypes, null, 2)} />
    </div>
  );
}

