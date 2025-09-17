import React, { useState } from "react";
import type { TableProps } from "antd";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";

interface IExpenseItem {
  key: string;
  name: string;
  age: number;
  address: string;
}

const originData = Array.from({ length: 100 }).map<IExpenseItem>((_, i) => ({
  key: i.toString(),
  name: `Edward ${i}`,
  age: 32,
  address: `London Park no. ${i}`,
}));

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: never;
  inputType: "number" | "text";
  record: IExpenseItem;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = props => {
  const { editing, dataIndex, title, inputType, children, ...restProps } = props;
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {!editing ? children : (
        <Form.Item
          rules={[{ required: true, message: `Please Input ${title}!` }]}
          name={dataIndex}
          style={{ margin: 0 }}>
          {inputNode}
        </Form.Item>
      )}
    </td>
  );
};

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<IExpenseItem[]>(originData);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: IExpenseItem): boolean => record.key === editingKey;

  const edit = (record: Partial<IExpenseItem> & { key: React.Key }): void => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = (): void => setEditingKey("");

  const save = async (key: React.Key): Promise<void> => {
    try {
      const row = (await form.validateFields()) as IExpenseItem;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
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
    {
      title: "name",
      dataIndex: "name",
      width: "25%",
      editable: true,
    },
    {
      title: "age",
      dataIndex: "age",
      width: "15%",
      editable: true,
    },
    {
      title: "address",
      dataIndex: "address",
      width: "40%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: unknown, record: IExpenseItem): React.JSX.Element => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginInlineEnd: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns: TableProps<IExpenseItem>["columns"] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IExpenseItem) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table<IExpenseItem>
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        components={{ body: { cell: EditableCell } }}
        pagination={{ onChange: cancel }}
      />
    </Form>
  );
};

export default App;