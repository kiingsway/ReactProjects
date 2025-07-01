export type TypeCSV = { key: string } & Record<string, string | number>;

export interface EditableColumn {
  key: string;
  dataIndex?: keyof IExpenseItem;
  title?: string;
  width?: number;
  editable?: boolean;
  // eslint-disable-next-line no-unused-vars
  render?: (value: unknown, record: IExpenseItem, index: number) => React.ReactNode;
}

export interface IExpenseItem {
  key: string;
  account: string;
  date: string;
  title: string;
  category: string;
  subcategory: string;
  value: number;
}