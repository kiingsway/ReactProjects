import { Button, Form, Popconfirm, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { IExpenseItem } from "../interfaces";
import EditableCell from "./EditableCell";
import { FaCog } from "react-icons/fa";
import IconText from "@/components/IconText";
import { MdClose, MdSave } from "react-icons/md";

interface Props {
  dataSource: IExpenseItem[];
  columns: ColumnsType<IExpenseItem>;
}

export default function ExpenseFormTable({ columns: defaultColumns, dataSource }: Props): React.JSX.Element {

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = React.useState("");
  const [data, setData] = React.useState<IExpenseItem[]>(dataSource);

  const isEditing = (item: IExpenseItem): boolean => item.key === editingKey;

  const cancel = (): void => setEditingKey("");

  const edit = (item: Partial<IExpenseItem> & { key: React.Key }): void => {
    form.setFieldsValue({ ...item });
    setEditingKey(item.key);
  };

  const save = async (key: React.Key): Promise<void> => {
    try {
      const row = (await form.validateFields()) as IExpenseItem;

      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    ...defaultColumns.map(c => ({ ...c, editable: true })),
    {
      title: <FaCog />, width: 100, editable: false,
      render: (_: unknown, item: IExpenseItem): React.JSX.Element => isEditing(item) ? (
        <>
          <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
            <Button type="text"><IconText text="Cancel" icon={<MdClose />} /></Button>
          </Popconfirm>
          <Button type="link" onClick={() => save(item.key)} style={{ marginInlineEnd: 8 }}>
            <IconText text="Save" icon={<MdSave />} />
          </Button>
        </>
      ) : (
        <Button
          type="link"
          size="small"
          disabled={editingKey !== ""}
          onClick={() => edit(item)}>
          Edit
        </Button>
      ),
    }
  ];

  const mergedColumns: ColumnsType<IExpenseItem> = columns.map(col => {
    if (!col.editable || !("dataIndex" in col)) return col;

    return {
      ...col,
      onCell: (record: IExpenseItem) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        size="small"
        columns={mergedColumns}
        dataSource={dataSource}
        rowClassName="editable-row"
        components={{ body: { cell: EditableCell } }}
        pagination={{
          onChange: cancel,
          pageSizeOptions: [50, 100],
          hideOnSinglePage: true,
          defaultPageSize: 50
        }}
      />
    </Form>
  );
}