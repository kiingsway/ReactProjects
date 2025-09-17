import React, { useEffect } from "react";
import type { FormProps } from "antd";
import { Button, DatePicker, Form, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import { AddctFormItem, DateProperties, NumberProperties, Page, RelationProperties, TAdcTypes } from "@/interfaces";
import axios from "axios";
import useBoolean from "@/hooks/useBoolean";
import { DefaultOptionType } from "antd/es/select";

interface Props {
  open: boolean;
  formType?: TAdcTypes;
  onClose: () => void;
  updateData: () => void;
  addctTypes: DefaultOptionType[];
}

export default function AddctModalForm({ open, formType, addctTypes, onClose, updateData }: Props): React.JSX.Element {

  const [loading, { setTrue: startSave, setFalse: stopSave }] = useBoolean();

  const [form] = Form.useForm<AddctFormItem>();

  const onFinish: FormProps<AddctFormItem>["onFinish"] = formItem => {
    try {
      const item = getDBPageProps(formItem);
      startSave();
      axios.post("/api/page", item)
        .then(() => {
          updateData();
          onClose();
        })
        .catch(e => {
          const msg = e?.response?.data?.message || e?.response?.data || e?.message || e || "Unknown error";
          alert(msg);
          console.error(msg);
        })
        .finally(stopSave);
    } catch (e) {
      const msg = e instanceof Error ? e.message : e;
      alert(msg);
      console.error(msg);
    }
  };

  useEffect(() => {
    if (open) {
      const addct: string | undefined = addctTypes.find(t => t.label === formType)?.value?.toString();
      form.resetFields();
      form.setFieldsValue({ addct, date: dayjs(), quantity: 1 });
    }
  }, [open, formType, form, addctTypes]);


  const onCancel = (): void => loading ? undefined : onClose();

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Add item"
      destroyOnHidden
      closable={!loading}
      maskClosable={!loading}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>Cancel</Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          onClick={form.submit}
          loading={loading}
          disabled={loading}>{loading ? "Saving..." : "Create"}</Button>,
      ]}
    >
      <Form<AddctFormItem>
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<AddctFormItem>
          label="Addct"
          name="addct"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select type" options={addctTypes} />
        </Form.Item>

        <Form.Item<AddctFormItem>
          label="Date"
          name="date"
          rules={[{ required: true }]}
        >
          <DatePicker format="DD/MM/YYYY HH:mm" showTime />
        </Form.Item>

        <Form.Item<AddctFormItem>
          label="Quantity"
          name="quantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>

      </Form>
    </Modal>
  );
}

export function getDBPageProps(formItem: AddctFormItem): Partial<Page> {
  const { addct, date, quantity } = formItem;
  if (!addct || addct.length < 8) throw new Error(`Invalid Page ID: "${addct}"`);
  const database_id = process.env.ADDCT_DB_ID;
  if (!database_id) throw new Error("CRITIAL ERROR: NO ENV: 'ADDCT_DB_ID'");
  return {
    parent: { database_id },
    properties: {
      Quantity: ({ number: quantity } as NumberProperties),
      Data: ({ date: { start: date.toISOString() } } as DateProperties),
      Type: ({ relation: [{ id: addct }] } as RelationProperties)
    }
  };
}