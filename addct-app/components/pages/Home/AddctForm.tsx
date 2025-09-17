import React from 'react';
import { Button, DatePicker, Form, InputNumber, Modal, Select } from 'antd';
import useBoolean from '@/components/hooks/useBoolean';
import dayjs from 'dayjs';
import { IAddctItem, IAddctItemForm, IAddctType } from '@/interfaces';
import axios from 'axios';
import { notification } from 'antd';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface Props {
  addctTypes?: IAddctType[];
}

export default function AddctForm({ addctTypes }: Props): React.JSX.Element {

  const [form] = Form.useForm();
  const [modal, { setTrue: openFormModal, setFalse: closeFormModal }] = useBoolean();
  const [loading, { setTrue: startLoad, setFalse: stopLoad }] = useBoolean();
  // const [selectedItem, selectItem] = React.useState<unknown>();
  // const openForm = (item?: unknown): void => { selectItem(item); openFormModal(); };
  // const closeForm = (): void => { selectItem(undefined); closeFormModal(); };

  const onFinish = (values: IAddctItemForm): void => {
    const useDate = values.Date.utc().format('YYYY-MM-DDTHH:mm');
    const item: IAddctItem = { ...values, Date: useDate };

    const finallyy = (): void => { stopLoad(); closeFormModal(); };

    startLoad();
    saveItem(item)
      .then(resp => {
        notification.success({
          message: 'Item created',
          description: `ID: ${(resp as { id: string })?.id}`,
        });
      })
      .catch(e => {
        const errormsg = e?.response?.data?.error || String(e);
        notification.error({
          message: 'Error saving item in Notion',
          description: `${errormsg}`,
        });
      })
      .finally(finallyy);
  };


  return (
    <div>
      <Button onClick={openFormModal}>Novo item</Button>
      <Modal
        title='New Log'
        open={modal}
        onOk={form.submit}
        okButtonProps={{
          disabled: loading,
          loading: loading,
        }}
        cancelButtonProps={{
          disabled: loading,
          loading: loading,
        }}
        onCancel={closeFormModal}>
        <Form<IAddctItemForm>
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout='horizontal'
          style={{ maxWidth: 600 }}
          form={form}
          initialValues={{
            Title: 'F1',
            Date: dayjs(),
            Quantity: 1
          }}
        >

          <Form.Item name='Title' label='Item' rules={[{ required: true }]}>
            <Select disabled={!addctTypes || !addctTypes.length}>
              {(addctTypes || []).map(item => {
                return (
                  <Select.Option key={item.id} value={item.Nome}>
                    {item.Nome}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item name='Date' label='Date' rules={[{ required: true }]}>
            <DatePicker format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }} />
          </Form.Item>

          <Form.Item name='Quantity' label='Qtd' rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

async function saveItem(item: IAddctItem): Promise<unknown> {
  const { data } = await axios.post('/api/save-item', item);
  return data;
}

