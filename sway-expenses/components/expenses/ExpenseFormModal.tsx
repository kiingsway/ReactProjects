import useBoolean from '@/hooks/useBoolean';
import { ICategoryItem, IExpenseFormItem, IExpenseItem, IExpenseProperties, NotionPayload } from '@/interfaces';
import { formItemLayout } from '@/services/constants';
import { generateUniqueKey, getErrorMessage, getRelationProp } from '@/services/helpers';
import { Alert, Button, DatePicker, Form, Input, InputNumber, Modal } from 'antd';
import React from 'react';
import ColDateRender from '../ColumnsRender/ColDateRender';
import { AiOutlineDelete } from 'react-icons/ai';
import IconText from '../Elements/IconText';
import axios from 'axios';
import { Select } from 'antd';
import dayjs from 'dayjs';

interface Props {
  open: boolean;
  expense?: IExpenseItem;
  onClose: () => void;
  updateData: () => void;
  allCategories: ICategoryItem[];
}

const database_id = process.env.NEXT_PUBLIC_EXPENSES_DB_ID;

export default function ExpenseFormModal({ open, expense, allCategories, updateData, onClose }: Props): React.JSX.Element {

  const pText = `"${expense?.Description || expense?.BankDescription || expense?.id}"`;

  const [form] = Form.useForm();
  const [loading, { setTrue: startLoad, setFalse: stopLoad }] = useBoolean();
  const [errors, setErrors] = React.useState<{ key: string, message: string }[]>([]);

  const randomString = (prefix = "", length = 5) =>
    prefix + Math.random().toString(36).substring(2, 2 + length).toUpperCase();

  const randomCurrency = (min = 10, max = 1000) =>
    parseFloat((Math.random() * (max - min) + min).toFixed(2));

  const fillForm = () => {
    form.setFieldsValue({
      Account: randomString("ACC_"),
      AccountType: ["Corrente", "Poupança", "Investimento"][Math.floor(Math.random() * 3)],
      BankDescription: `Compra #${Math.floor(Math.random() * 100) + 1}`,
      Description: `Descrição ${Math.floor(Math.random() * 100) + 1}`,
      TransactionDate: dayjs(),
      Balance: randomCurrency(100, 5000),
      Total: randomCurrency(5, 500)
    });
  };


  const removeError = (key: string) => setErrors(prev => prev.filter(p => p.key !== key));
  const addError = (err: unknown, msg = "") => {
    const message = [msg, getErrorMessage(err)].filter(Boolean).join(" - ").trim();
    const key = message;
    setErrors(prev => prev.some(e => e.key === key) ? prev : [...prev, { key, message }]);
  }

  const onDelete = async (): Promise<void> => {
    if (!expense) return;

    if (window.confirm(`Are you sure you want to delete the category ${pText}?`)) {
      startLoad();
      try {
        await axios.delete(`/api/pages/${expense.id}`);
        updateData();
        onClose();
      } catch (err) {
        addError(err, `Não foi possível excluir o item ${pText}`);
      } finally {
        stopLoad();
      }
    }
  };

  const onFinish = async (formItem: IExpenseFormItem): Promise<void> => {
    startLoad();
    try {
      const itemData = convertExpenseFormToNotionData(formItem, expense?.id);
      const result = await saveExpenseInNotion(itemData);

      if (!result.success) {
        addError(result.error);
        return;
      }

      updateData();
      onClose();

    } catch (err) {
      addError(err, `Erro inesperado ao salvar o item ${pText}`);
    } finally {
      stopLoad();
      return;
    }
  }


  React.useEffect(() => {
    if (!open) return;

    setErrors([]);

    if (!expense) {
      form.resetFields();
      form.setFieldsValue({ key: generateUniqueKey() })
    }
    else form.setFieldsValue(convertExpenseToFormData(expense));

  }, [open, expense, form]);

  type TOption = { label: string, value: string };

  const { categories, subcategories } = React.useMemo(() => {
    return allCategories.reduce<{ categories: TOption[]; subcategories: TOption[] }>((acc, item) => {
      if (!item.Parent || !item.Parent.length) acc.categories.push({ label: item.Title, value: item.id });
      else acc.subcategories.push({ label: item.Title, value: item.id });
      return acc;
    }, { categories: [], subcategories: [] });
  }, [allCategories]);

  return (
    <Modal
      open={open}
      onCancel={loading ? undefined : onClose}
      title={expense ? `Edit Expense: ${pText}` : "Create Expense"}
      onOk={form.submit}
      cancelButtonProps={{ disabled: loading }}
      okButtonProps={{ loading, disabled: loading }}
      styles={{ header: { paddingBottom: 15 } }}
    >
      {!expense && <Button onClick={fillForm}>Fill Form</Button>}
      <Form
        onFinish={onFinish}
        key={expense?.id || "new"}
        {...formItemLayout}
        form={form}
      >
        {!!expense && <Form.Item name="id" label="ID"><Input disabled /></Form.Item>}

        <Form.Item name="key" label="Key" rules={[{ required: true, message: "Please input!" }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item label="Account" name="Account" rules={[{ required: true, message: "Please input!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Account Type" name="AccountType" rules={[{ required: true, message: "Please input!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Date" name="TransactionDate" rules={[{ required: true, message: "Please input!" }]}>
          <DatePicker format="DD MMMM YYYY" />
        </Form.Item>

        <Form.Item label="Bank Description" name="BankDescription" rules={[{ required: true, message: "Please input!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="Description" rules={[{ required: true, message: "Please input!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Category" name={["Category", "id"]} rules={[{ required: true, message: "Please input!" }]}>
          <Select placeholder="Select a category..." options={categories} />
        </Form.Item>

        <Form.Item label="Subcategory" name={["Subcategory", "id"]} rules={[{ required: true, message: "Please input!" }]}>
          <Select placeholder="Select a subcategory..." options={subcategories} />
        </Form.Item>

        <Form.Item label="Balance" name="Balance" rules={[{ required: true, message: "Please input!" }]}>
          <InputNumber<number>
            formatter={v => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={v => v?.replace(/\$\s?|(,*)/g, '') as unknown as number}
          />
        </Form.Item>

        <Form.Item label="Total" name="Total" rules={[{ required: true, message: "Please input!" }]}>
          <InputNumber<number>
            formatter={v => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={v => v?.replace(/\$\s?|(,*)/g, '') as unknown as number}
          />
        </Form.Item>

        {!!expense && (
          <>
            <Form.Item label="Created"><ColDateRender date={expense.created_time} className="pl-1" /></Form.Item>
            <Form.Item label="Modified"><ColDateRender date={expense.last_edited_time} className="pl-1" /></Form.Item>
            <Form.Item label=" " colon={false}>
              <Button
                type="text"
                disabled={loading}
                loading={loading}
                onClick={onDelete} danger>
                <IconText text="Delete" icon={<AiOutlineDelete />} />
              </Button>
            </Form.Item>
          </>
        )}

      </Form>
      {errors.map(({ key, message }) => {
        return <Alert key={key} message={message} type="error" closable onClose={() => removeError(key)} />
      })}
    </Modal>
  );
}

const convertExpenseToFormData = (item: IExpenseItem): IExpenseFormItem => {
  return {
    ...item,
    TransactionDate: dayjs(item.TransactionDate)
  };
};

const convertExpenseFormToNotionData = (item: IExpenseFormItem, expenseId?: string): NotionPayload<IExpenseProperties> => {

  if (!database_id) throw new Error("CRITIAL ERROR: NO EXPENSES DATABASE ID");

  const categoryId = getRelationProp(item.Category?.id);
  const subcategoryId = getRelationProp(item.Category?.id);

  return {
    ...(expenseId ? { page_id: expenseId } : { parent: { database_id } }),
    properties: {
      key: { title: [{ text: { content: item.key || generateUniqueKey() } }] },
      Account: { rich_text: [{ text: { content: item.Account } }] },
      "Account Type": { rich_text: [{ text: { content: item.AccountType } }] },
      "Bank Description": { rich_text: [{ text: { content: item.BankDescription || "" } }] },
      Description: { rich_text: [{ text: { content: item.Description || "" } }] },
      Date: { date: { start: item.TransactionDate?.format("YYYY-MM-DD") } },
      ...(categoryId && { Category: categoryId }),
      ...(subcategoryId && { Subcategory: subcategoryId }),
      Balance: { number: item.Balance },
      Total: { number: item.Total }
    }
  }
};

export async function saveExpenseInNotion(data: NotionPayload<IExpenseProperties>): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const isUpdate = "page_id" in data;
  const url = isUpdate ? `/api/pages/${data.page_id}` : `/api/databases/${database_id}`;

  const isGoodToGo = validateUpdatePayload(data);
  if (!isGoodToGo) return { success: false, error: "Invalid data" };

  try {
    const response = await axios.post(url, data);
    return { success: true, data: response.data };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface IPayload { page_id: string; properties: Record<string, any>; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateUpdatePayload(data: any): data is IPayload {
  const hasPageId = typeof data.page_id === "string" && data.page_id.trim().length > 0;

  const hasDatabaseId =
    typeof data.parent === "object" &&
    data.parent !== null &&
    typeof data.parent.database_id === "string" &&
    data.parent.database_id.trim().length > 0;

  const hasProperties =
    data.properties &&
    typeof data.properties === "object" &&
    Object.keys(data.properties).length > 0;

  return (hasPageId || hasDatabaseId) && hasProperties;
}