/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Modal, Form, Input, DatePicker, Checkbox } from 'antd';
import { ITask, ITaskForm } from '.';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  open: boolean;
  task?: ITask;
  onSave: (id: string, updatedFields: ITask) => void
  onClose: () => void;
}

export default function TaskModal({ open, task, onSave, onClose }: Props): React.JSX.Element {

  const [form] = Form.useForm();

  const onFinish = (values: ITaskForm): void => {
    if (!task) return;

    const newTask: ITask = {
      ...task,
      title: values.title,
      completed: values.completed || false,
      dueDate: values.dueDate ? values.dueDate.toISOString() : '',
      description: values.description || '',
      modified: dayjs().toISOString(),
    };

    onSave(task.id, newTask);
    onClose();
  };

  React.useEffect(() => {
    if (!open) form.resetFields();
    if (task) {
      form.setFieldsValue({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        created: task.created ? dayjs(task.created) : null,
        modified: task.modified ? dayjs(task.modified) : null,
      });
    }
  }, [form, open, task]);

  return (
    <Modal
      title={`Tarefa: ${task?.title}`}
      open={open}
      onOk={form.submit}
      onCancel={onClose}
      okText='Salvar'
      cancelText='Cancelar'
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ margin: '25px 0 0 0' }}
        onFinish={onFinish}>

        <Form.Item label='ID' name='id'>
          <Input disabled />
        </Form.Item>

        <Form.Item name='completed' valuePropName='checked' label=' ' colon={false}>
          <Checkbox>Concluída</Checkbox>
        </Form.Item>

        <Form.Item
          label='Título'
          name='title'
          rules={[{ required: true, message: 'Digite um título' }]}
        >
          <Input placeholder='Task title...' />
        </Form.Item>

        <Form.Item label='Due Date' name='dueDate'>
          <DatePicker format='DD/MM/YYYY' />
        </Form.Item>

        <Form.Item label='Description' name='description'>
          <Input.TextArea placeholder='Description of the task...' />
        </Form.Item>

        <Form.Item label='Created' name='created'>
          <DatePicker format='DD/MM/YYYY HH:mm:ss' disabled />
        </Form.Item>

        <Form.Item label='Modified' name='modified'>
          <DatePicker format='DD/MM/YYYY HH:mm:ss' disabled />
        </Form.Item>

      </Form>
    </Modal>
  );
}
