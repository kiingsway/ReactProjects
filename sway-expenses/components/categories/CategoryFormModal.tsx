import { Alert, Button, Form, Input, Modal, Select } from "antd";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import useBoolean from "@/hooks/useBoolean";
import axios from "axios";
import { ICategoryItem, ICategoryProperties, NotionPayload } from "@/interfaces";
import IconText from "../Elements/IconText";
import ColDateRender from "../ColumnsRender/ColDateRender";
import { getErrorMessage } from "@/services/helpers";
import { DefaultOptionType } from "antd/es/select";
import { formItemLayout } from "@/services/constants";

interface Props {
  open: boolean;
  category?: ICategoryItem;
  allCategories: ICategoryItem[]
  onClose: () => void;
  updateData: () => void;
}

export interface ICategoryFormItem {
  Title: string;
  Parent: string[];
  Children: string[];
}

export default function CategoryFormModal({ allCategories, category, open, updateData, onClose }: Props): React.JSX.Element {

  const [form] = Form.useForm();
  const [loading, { setTrue: startLoad, setFalse: stopLoad }] = useBoolean();
  const [errors, setErrors] = React.useState<{ key: string, message: string }[]>([]);

  const addError = (err: unknown, msg = "") => {
    const message = [msg, getErrorMessage(err)].filter(Boolean).join(" - ").trim();
    const key = message;
    setErrors(prev => prev.some(e => e.key === key) ? prev : [...prev, { key, message }]);
  }

  const removeError = (key: string) => setErrors(prev => prev.filter(p => p.key !== key));

  const pText = `"${category?.Title || category?.id}"`;
  const modalTitle = category ? `Edit Category: ${pText}` : "Create Category";

  const onFinish = async (item: ICategoryFormItem): Promise<void> => {
    startLoad();
    const pText = `"${item.Title}"`;
    const itemData = handleCategoryNotionItem(item, category?.id);

    try {
      const result = await saveCategoryInNotion(itemData);

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
    }
  };

  const onDelete = async (): Promise<void> => {
    if (!category) return;

    if (window.confirm(`Are you sure you want to delete the category ${pText}?`)) {
      startLoad();
      try {
        await axios.delete(`/api/pages/${category.id}`);
        updateData();
        onClose();
      } catch (err) {
        addError(err, `Não foi possível excluir o item ${pText}`);
      } finally {
        stopLoad();
      }
    }
  };

  React.useEffect(() => {
    if (!open) return;

    setErrors([]);

    if (!category) form.resetFields();

    else form.setFieldsValue({
      ...category,
      Parent: category.Parent.map(i => i.id),
      Children: category.Children.map(i => i.id),
    });

  }, [open, category, form]);

  const childrensOptions: DefaultOptionType[] = allCategories.map(c => ({ value: c.id, label: c.Title }))

  return (
    <Modal
      open={open}
      onCancel={loading ? undefined : onClose}
      title={modalTitle}
      onOk={form.submit}
      cancelButtonProps={{ disabled: loading }}
      okButtonProps={{ loading, disabled: loading }}
    >
      <Form
        onFinish={onFinish}
        className="pt-4"
        key={category?.id || "new"}
        {...formItemLayout}
        form={form}
      >
        {!!category && <Form.Item name="id" label="ID"><Input disabled /></Form.Item>}

        <Form.Item
          label="Title"
          name="Title"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Parent" name="Parent">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            disabled={allCategories.length === 0}
            options={allCategories.map(c => ({ value: c.id, label: c.Title }))}
            placeholder="Select a parent if subcategory..."
            allowClear
          />
        </Form.Item>

        {!!category && (
          <Form.Item name="Children" label="Children">
            <Select
              disabled
              mode="multiple"
              style={{ width: '100%' }}
              options={childrensOptions}
            />
          </Form.Item>
        )}

        {!!category && (
          <>
            <Form.Item label="Created"><ColDateRender date={category.created_time} className="pl-1" /></Form.Item>
            <Form.Item label="Modified"><ColDateRender date={category.last_edited_time} className="pl-1" /></Form.Item>
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
      {errors && errors.length ? (
        <>
          {errors.map(({ key, message }) => {
            return <Alert key={key} message={message} type="error" closable onClose={() => removeError(key)} />
          })}
        </>
      ) : <></>}
    </Modal>
  );
}

function handleCategoryNotionItem(item: ICategoryFormItem, categoryId?: string): NotionPayload<ICategoryProperties> {

  const database_id = process.env.NEXT_PUBLIC_CATEGORIES_DB_ID;
  if (!database_id) throw new Error("CRITIAL ERROR: NO CATEGORY ID");

  return {
    ...(categoryId ? { page_id: categoryId } : { parent: { database_id } }),
    properties: {
      Title: { title: [{ text: { content: item.Title || "" } }] },
      ...(item.Parent && item.Parent.length && { Parent: { relation: item.Parent.map(id => ({ id })) } })
    }
  };
}

export async function saveCategoryInNotion(data: NotionPayload<ICategoryProperties>): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const isUpdate = "page_id" in data;
  const url = isUpdate ? `/api/pages/${data.page_id}` : `/api/databases/${process.env.NEXT_PUBLIC_CATEGORIES_DB_ID}`;

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