import { Button, Form, Input, Modal, Select } from "antd";
import React from "react";
import { ICategoryItem, IPatternFormItem, IPatternItem, ISubCategoryItem, PatternNotionPayload } from "../interfaces";
import ColumnDate from "../columns/ColumnDate";
import IconText from "@/components/IconText";
import { AiOutlineDelete } from "react-icons/ai";
import useBoolean from "@/hooks/useBoolean";
import axios from "axios";
import notifyAxiosError from "../components/notifyAxiosError";
import { getErrorMessage } from "@/app/services/helpers";


interface Props {
  open: boolean;
  pattern?: IPatternItem;
  allCategories: ICategoryItem[]
  onClose: () => void;
  updateData: () => void;
}

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

export default function PatternFormModal({ allCategories, pattern, open, updateData, onClose }: Props): React.JSX.Element {

  const [form] = Form.useForm();
  const [loading, { setTrue: startLoad, setFalse: stopLoad }] = useBoolean();

  const pText = `"${pattern?.Title || pattern?.Match || pattern?.id}"`;
  const modalTitle = pattern ? `Edit Pattern: ${pText}` : "Create Pattern";

  const onFinish = async (item: IPatternFormItem): Promise<void> => {
    startLoad();
    const pText = `"${item?.Title || item.Match || pattern?.id}"`;
    const itemData = handlePatternNotionItem(item, pattern?.id);

    try {
      const result = await savePatternInNotion(itemData);

      if (!result.success) {
        notifyAxiosError(result.error, `Não foi possível criar o item ${pText}`);
        return;
      }

      updateData();
      onClose();
    } catch (err) {
      // Essa parte agora só seria usada para falhas inesperadas fora do axios
      notifyAxiosError(err, `Erro inesperado ao salvar o item ${pText}`);
    } finally {
      stopLoad();
    }
  };



  const onDelete = async (): Promise<void> => {
    if (!pattern) return;

    if (window.confirm(`Are you sure you want to delete the pattern ${pText}?`)) {
      startLoad();
      try {
        await axios.delete(`/api/page/${pattern.id}`);
        updateData();
        onClose();
      } catch (err) {
        notifyAxiosError(err, `Não foi possível excluir o item ${pText}`);
      } finally {
        stopLoad();
      }
    }
  };

  type CatReduce = { categories: ICategoryItem[], subcategories: ISubCategoryItem[] };
  const { categories, subcategories } = allCategories.reduce((prev, curr) => {
    if (curr.Parent) return { ...prev, subcategories: [...prev.subcategories, curr as ISubCategoryItem] };
    else return { ...prev, categories: [...prev.categories, curr] };
  }, { categories: [], subcategories: [] } as CatReduce);


  React.useEffect(() => {
    if (!open) return;

    if (!pattern) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        ...pattern,
        Category: pattern.Category?.id,
        Subcategory: pattern.Subcategory?.id,
      });
    }
  }, [open, pattern, form]);


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
        key={pattern?.id || "new"}
        {...formItemLayout}
        form={form}
      >
        {!!pattern && <Form.Item name="id" label="ID"><Input disabled /></Form.Item>}

        <Form.Item
          label="Match"
          name="Match"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Title" name="Title"><Input /></Form.Item>

        <Form.Item
          label="Category"
          name="Category"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select
            options={categories.map(c => ({ value: c.id, label: c.Title }))}
            placeholder="Select a category"
          />

        </Form.Item>

        <Form.Item
          label="Subcategory"
          name="Subcategory"
          rules={[{ required: true, message: "Please select a subcategory!" }]}
        >
          <Select
            disabled={subcategories.length === 0}
            options={subcategories.map(sc => ({ value: sc.id, label: sc.Title }))}
            placeholder="Select a subcategory"
          />
        </Form.Item>

        {!!pattern && (
          <>
            <Form.Item label="Created"><ColumnDate date={pattern.created_time} className="pl-1" /></Form.Item>
            <Form.Item label="Modified"><ColumnDate date={pattern.last_edited_time} className="pl-1" /></Form.Item>
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
    </Modal>
  );
}

function handlePatternNotionItem(item: IPatternFormItem, patternId?: string): PatternNotionPayload {

  const database_id = process.env.NEXT_PUBLIC_PATTERNS_DB_ID;
  if (!database_id) throw new Error("CRITIAL ERROR: NO PATTERNS ID");

  return {
    ...(patternId ? { page_id: patternId } : { parent: { database_id } }),
    properties: {
      Match: { rich_text: [{ text: { content: item.Match } }] },
      ...(item.Title && { Title: { title: [{ text: { content: item.Title } }] } }),
      Category: { relation: [{ id: item.Category }] },
      Subcategory: { relation: [{ id: item.Subcategory }] },
    }
  };
}

export async function savePatternInNotion(data: PatternNotionPayload): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const isUpdate = "page_id" in data;
  const url = isUpdate ? "/api/notion/edit-page" : "/api/notion/create-page";

  const isGoodToGo = validateUpdatePayload(data);
  if (!isGoodToGo) {
    console.group("Não foi validado. ");
    console.log("data", data.page_id);
    console.groupEnd();
    return { success: false, error: "Não validado" };
  };

  try {
    const response = await axios.post(url, data);
    return { success: true, data: response.data };
  } catch (err: unknown) {

    const error = getErrorMessage(err);

    return { success: false, error };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface IPayload { page_id: string; properties: Record<string, any>; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateUpdatePayload(data: any): data is IPayload {
  const isValidId = typeof data.page_id === "string" && data.page_id.trim().length > 0;
  const hasProperties = data.properties && typeof data.properties === "object" && Object.keys(data.properties).length > 0;
  return isValidId && hasProperties;
}