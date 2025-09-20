/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAddctFormItem, IAddctItem, IAddctType } from '@/pages/AddctApp';
import useBoolean from '@/services/hooks/useBoolean';
import { DatePicker, Form, InputNumber, Modal, notification, Select } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import React from 'react';

interface Props {
  open: boolean;
  selectedType: IAddctType | undefined;
  closeForm: () => void;
  allTypes: IAddctType[];
}

export default function AddctItemFormModal({ closeForm, open, selectedType, allTypes }: Props): React.JSX.Element {

  const [form] = Form.useForm();
  const [loading, { setTrue: startLoad, setFalse: stopLoad }] = useBoolean();

  const onFinish = (values: IAddctFormItem): void => {
    startLoad();
    const { Date, Quantity, Type } = values;

    const Title = allTypes.find(t => t.id === Type)?.title;
    if (!Title) {
      notification.error({ message: `Tipo "${Type}" não foi encontrado` });
      return;
    }

    const newItem = {
      Title, Quantity,
      Date: Date.toISOString(),
      Type: { id: Type, value: Title }
    };

    saveItem(newItem)
      .then(console.log)
      .catch(e => notification.error({ message: e }))
      .finally(() => { stopLoad(); closeForm(); });
  };

  React.useEffect(() => {
    if (!open) form.resetFields();
    else form.setFieldsValue({
      Title: selectedType?.title,
      Date: dayjs(),
      Quantity: 1,
      Type: selectedType?.id
    });
  }, [selectedType, open, form]);

  return (
    <Modal
      title='Add Addct Item'
      open={open}
      onCancel={closeForm}
      onOk={form.submit}
      okButtonProps={{ loading }}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ marginTop: 20 }}
        onFinish={onFinish}
        form={form}>

        <Form.Item name='Type' label='Type' rules={[{ required: true }]}>
          <Select options={allTypes.map(t => ({ label: t.title, value: t.id }))} />
        </Form.Item>

        <Form.Item name='Date' label='Date' rules={[{ required: true }]}>
          <DatePicker showTime format='MMMM DD, YYYY HH:mm' />
        </Form.Item>

        <Form.Item name='Quantity' label='Quantity' rules={[{ required: true }]}>
          <InputNumber min={0} max={10} />
        </Form.Item>

      </Form>
    </Modal>
  );
}

async function saveItem(item: Omit<IAddctItem, 'id'>): Promise<any> {
  try {
    const response = await axios.post('/api/save-item', item, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Item salvo com sucesso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao salvar item:', error.response?.data || error.message);
    throw error;
  }
}