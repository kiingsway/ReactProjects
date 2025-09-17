import { Form, Input, InputNumber } from "antd";
import { IExpenseItem } from "../interfaces";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: never;
  inputType: "number" | "text";
  record: IExpenseItem;
  index: number;
}

export default function EditableCell(props: React.PropsWithChildren<EditableCellProps>): JSX.Element {
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
}