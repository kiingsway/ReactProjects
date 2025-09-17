import { IConvertExpenseRule } from '@/interfaces';
import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import IconText from '../Elements/IconText';

interface Props {
  match?: IConvertExpenseRule;
  open: boolean;
  onClose: () => void;
  setMatches: React.Dispatch<React.SetStateAction<IConvertExpenseRule[]>>
}

export default function MatchesModalForm({ setMatches, match, open, onClose }: Props): React.JSX.Element {

  const [form] = Form.useForm<IConvertExpenseRule>();

  const handleFinish = (newMatch: IConvertExpenseRule) => {
    console.log(newMatch);
    if (!match) { // Add Rule
      setMatches(prev => [...prev, newMatch]);
    } else { // Update Rule
      setMatches(prev => prev.map(m => m.match === match.match ? { ...m, ...newMatch } : m));
    }
    onClose();
  };

  const deleteMatch = (): void => {
    if (!match) return;
    if (window.confirm(`Are you sure you want to delete "${match.match}"?`)) {
      setMatches(prev => prev.filter(m => m.match !== match.match))
      onClose();
    }
  }

  React.useEffect(() => {
    if (open) {
      if (match) form.setFieldsValue(match);
      else form.resetFields();
    }
  }, [open, match, form]);


  const modalTitle = match ? `Editing "${match.match}"` : "Create Match";

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onClose}
      onOk={form.submit}
    >
      <Form<IConvertExpenseRule>
        style={{ padding: "20px 0 10px" }}
        form={form}
        onFinish={handleFinish}
        {...formItemLayout}
      >
        <Form.Item
          label="Match"
          name="match"
          rules={[{ required: true, message: 'O campo "match" é obrigatório.' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Title" name="Title">
          <Input />
        </Form.Item>

        <Form.Item
          label="Category"
          name="Category"
          rules={[{ required: true, message: 'O campo "Category" é obrigatório.' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Subcategory"
          name="Subcategory"
          rules={[{ required: true, message: 'O campo "Subcategory" é obrigatório.' }]}
        >
          <Input />
        </Form.Item>

        {match && <Form.Item label=" " colon={false}>
          <Button type='text' onClick={deleteMatch} danger><IconText text='Delete' /></Button>
        </Form.Item>}

      </Form>
    </Modal>
  );
}

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};