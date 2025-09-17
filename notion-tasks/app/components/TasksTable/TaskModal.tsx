import { IProjectTask } from '@/interfaces';
import { Button, Form, Input, Modal, Tooltip } from 'antd';
import { DateTime } from 'luxon';
import React from 'react';
import ColumnDate from './ColumnDate';

interface Props {
  open: boolean;
  onClose: () => void;
  task?: IProjectTask;
}

export default function TaskModal({ onClose, open, task }: Props): React.JSX.Element {

  if (!task) return <></>;

  const URLButton = (): React.JSX.Element => {
    const onClick = (): void => { window.open(task.url, '_blank', 'noopener,noreferrer'); };

    return (
      <Tooltip title={task.url}>
        <Button onClick={onClick} type='primary'>Open Task in Notion</Button>
      </Tooltip>
    );
  };

  return (
    <Modal
      open={open}
      onOk={onClose}
      onCancel={onClose}
      title={task?.['Nome da Tarefa']}>
      <Form<IProjectTask>
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={task}
        autoComplete="off"
      >
        <Form.Item label="ID" name="id"><Input /></Form.Item>
        <Form.Item label="Title" name="Nome da tarefa"><Input /></Form.Item>
        <Form.Item label="Description" name="Descrição"><Input.TextArea /></Form.Item>
        <Form.Item label="Priority" name="Prioridade"><Input /></Form.Item>
        <Form.Item label="Status" name="Status"><Input /></Form.Item>
        <Form.Item label="Status (Text)" name="Status Text"><Input /></Form.Item>
        <Form.Item label="Due Date"><ColumnDate value={task['Prazo']} as='input' /></Form.Item>
        <Form.Item label="Created"><ColumnDate value={task.created_time} as='input' /></Form.Item>
        <Form.Item label="Modified"><ColumnDate value={task.last_edited_time} as='input' /></Form.Item>
        <Form.Item label={null}><URLButton /></Form.Item>
      </Form>
      <Input.TextArea rows={8} value={JSON.stringify(task, null, 2)} />
    </Modal>
  );
}