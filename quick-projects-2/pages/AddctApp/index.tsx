import AppNav from '@/components/AppNav';
import React from 'react';
import styles from './AddctApp.module.scss';
import useSWR from 'swr';
import axios from 'axios';
import { notification } from 'antd';
import Toolbar from '@/components/AddctApp/Toolbar';
import AddctItemFormModal from '@/components/AddctApp/AddctItemFormModal';
import useBoolean from '@/services/hooks/useBoolean';
import { Dayjs } from 'dayjs';

export interface IAddctType {
  id: string;
  title: string;
  points: number;
}

export interface IAddctItem {
  id: string;
  Title: string;
  Date: string;
  Quantity: number;
  Type: null | {
    id: string;
    value: string;
  }
}

export interface IAddctFormItem extends Omit<IAddctItem, 'Date' | 'Type'> {
  Date: Dayjs;
  Type: string;
}

export default function AddctApp(): React.JSX.Element {

  const fetcher = async <T,>(url: string): Promise<T[]> => (await axios.get<T[]>(url)).data;
  const { data: types, error: typesError, isValidating: typesValidating, mutate: updateItems } = useSWR('/api/get-addct-types', fetcher<IAddctType>);
  const { data: items, error: itemsError, isValidating: itemsValidating, mutate: updateTypes } = useSWR('/api/get-addct-items', fetcher<IAddctItem>);
  const updateData = (): void => { updateItems(); updateTypes(); };

  console.log('items', items);

  const [selectedType, selectType] = React.useState<IAddctType>();
  const [formOpen, { setTrue: openModalForm, setFalse: closeModalForm }] = useBoolean();

  const openForm = (type: IAddctType | undefined): void => {
    selectType(type);
    openModalForm();
  };

  const closeForm = (): void => {
    selectType(undefined);
    closeModalForm();
  };

  React.useEffect(() => {
    const errors = [typesError, itemsError].filter(Boolean);
    errors.forEach(e => {
      const message = String(e);
      const description = e.response.data.error || '';
      notification.error({ description, message });
    });
  }, [typesError, itemsError]);

  return (
    <AppNav name={AddctApp.name}>
      <div className={styles.main}>
        <Toolbar
          onUpdate={updateData}
          isLoading={typesValidating || itemsValidating}
          openForm={openForm}
          types={types} />
      </div>

      <AddctItemFormModal
        allTypes={types || []}
        open={formOpen}
        selectedType={selectedType}
        closeForm={closeForm} />
    </AppNav>
  );
}

export function maskString(text: string): string {
  return text;
  const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowers = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%&*()-=_';
  const chars = uppers + lowers + numbers + symbols;

  return text
    .split('')
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join('');
}