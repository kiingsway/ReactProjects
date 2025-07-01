import { Button, Form, Input, InputNumber, Popconfirm, Table, Tooltip } from "antd";
import React from "react";
import { EditableColumn, IExpenseItem, TypeCSV } from "./interfaces";
import { ColumnsType } from "antd/es/table";
import { HiKey } from "react-icons/hi";
import { convertRBCDataToNotion } from "./helpers";

interface Props {
  data: TypeCSV[];
  showKey: boolean;
}

export default function CSVEditableTable({ data, showKey }: Props): React.JSX.Element {

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = React.useState("");

  const dataSource = React.useMemo(() => convertRBCDataToNotion(data), [data]);
  const [editedData, setEditedData] = React.useState<IExpenseItem[]>(dataSource);

  React.useEffect(() => {
    setEditedData(dataSource);
  }, [dataSource]);

  const isEditing = (item: IExpenseItem): boolean => item.key === editingKey;

  const cancel = (): void => setEditingKey("");

  const edit = (record: Partial<IExpenseItem> & { key: React.Key }): void => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const save = async (key: React.Key): Promise<void> => {
    try {
      const row = (await form.validateFields()) as IExpenseItem;

      const newData = [...editedData];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setEditedData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setEditedData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const ItemAction = ({ item }: { item: IExpenseItem }): React.JSX.Element => {
    const editable = isEditing(item);
    const onEdit = (): void => edit(item);
    const onSave = (): Promise<void> => save(item.key);
    return (
      <div className="flex gap-1">
        {!editable ?
          <Button size="small" type="link" disabled={editingKey !== ""} onClick={onEdit}>Edit</Button>
          : (
            <>
              <Button size="small" type="primary" onClick={onSave}>Save</Button>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <Button size="small" type="text">Cancel</Button>
              </Popconfirm>
            </>
          )
        }
      </div>
    );
  };

  const columns: EditableColumn[] = [
    showKey && {
      key: "key", dataIndex: "key", title: "Key", width: 20,
      render: (key: string): React.ReactNode => !key ? <></> : <Tooltip title={key}><HiKey /></Tooltip>,
    },
    { key: "account", dataIndex: "account", title: "Account" },
    { key: "date", dataIndex: "date", title: "Date", editable: true },
    { key: "title", dataIndex: "title", title: "Title", editable: true },
    { key: "category", dataIndex: "category", title: "Category", editable: true },
    { key: "subcategory", dataIndex: "subcategory", title: "Subcategory", editable: true },
    { key: "value", dataIndex: "value", title: "Value", editable: true },
    { key: "action", width: 125, render: (_: unknown, item: IExpenseItem): React.ReactNode => <ItemAction item={item} /> },
  ].filter(Boolean) as EditableColumn[];



  const mergedColumns: ColumnsType<IExpenseItem> = columns.map(col => {
    if (!col?.editable) return col;

    const { dataIndex, title } = col;

    const inputTypes: Record<keyof IExpenseItem, EditableCellProps["inputType"]> = {
      account: "text",
      category: "select",
      subcategory: "select",
      date: "date",
      key: "text",
      title: "text",
      value: "number"
    };

    return {
      ...col,
      onCell: (record: IExpenseItem) => ({
        record, dataIndex, title,
        inputType: col.dataIndex ? inputTypes[col.dataIndex] : undefined,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        size="small"
        columns={mergedColumns}
        dataSource={editedData}
        components={{ body: { cell: EditableCell } }}
        pagination={{
          hideOnSinglePage: true,
          pageSizeOptions: [10, 20, 40],
          onChange: cancel
        }}
      />
    </Form>
  );
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "number" | "text" | "date" | "select";
  values?: { value: string, label?: string }[];
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
          name={dataIndex} style={{ margin: 0 }}>
          {inputNode}
        </Form.Item>)}
    </td>
  );
};