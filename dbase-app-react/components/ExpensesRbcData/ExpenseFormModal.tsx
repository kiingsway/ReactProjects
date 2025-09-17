import React from "react";
import { DatePicker, Form, Input, InputNumber, Modal } from "antd";
import IconText from "../IconText";
import { MdCloud } from "react-icons/md";
import { IoCloudOfflineOutline } from "react-icons/io5";
import { IExpenseFormItem, IExpenseItem } from "./interfaces";
import dayjs from "dayjs";

interface Props {
  expense?: IExpenseItem;
  open: boolean;
  onCancel: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit?: (values: IExpenseFormItem) => void;
  isCloudSave?: boolean;
}

export default function ExpenseFormModal({ expense, open, isCloudSave, onCancel, onSubmit }: Props): React.JSX.Element {

  const [form] = Form.useForm<IExpenseFormItem>();
  const formalTitle = expense?.Title || expense?.BankDescription || "No expense selected";

  React.useEffect(() => {
    if (open && expense) {
      form.resetFields();
      form.setFieldsValue(getDayjsTransactionDate(expense));
    }
  }, [open, form, expense]);

  const Content = (): React.JSX.Element => {
    if (!expense) return <b>No Expense selected</b>;
    return (
      <Form<IExpenseFormItem>
        {...formItemLayout}
        onFinish={onSubmit}
        form={form}
        variant="outlined"
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Key" name="key">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Account" name="Account">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Account Type" name="AccountType">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Transaction Date" name="TransactionDate">
          <DatePicker format="DD MMMM YYYY" disabled />
        </Form.Item>

        <Form.Item label="Bank Description" name="BankDescription">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Title"
          name="Title"
          rules={[{ required: true, message: "Please input!" }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Category"
          name="Category"
          rules={[{ required: true, message: "Please input!" }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Subcategory"
          name="Subcategory"
          rules={[{ required: true, message: "Please input!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Balance" name="Balance">
          <InputNumber formatter={v => "$ " + v} disabled />
        </Form.Item>

        <Form.Item label="Total" name="Total">
          <InputNumber formatter={v => "$ " + v} disabled />
        </Form.Item>

      </Form>
    );
  };

  return (
    <Modal
      title={`Expense Item "${formalTitle}"`}
      open={open}
      onOk={form.submit}
      onCancel={onCancel}>
      <div className="flex items-end">
        <IsCloudSave isCloudSave={isCloudSave} />
      </div>
      <Content />
    </Modal>
  );
}

const IsCloudSave: React.FC<{ isCloudSave?: boolean }> = ({ isCloudSave }) => {
  if (isCloudSave) return <small><IconText text="Cloud (Notion)" icon={<MdCloud />} /></small>;
  else return <small><IconText text="Local" icon={<IoCloudOfflineOutline />} /></small>;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

function getDayjsTransactionDate(expense: IExpenseItem): IExpenseFormItem {
  return {
    ...expense,
    TransactionDate: dayjs(expense?.TransactionDate)
  };
}