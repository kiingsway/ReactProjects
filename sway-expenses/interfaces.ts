import { Dayjs } from "dayjs";

type TRelationProps = { id: string; name: string; };

export interface TitleProperties {
  id: string
  type: "title"
  title: { type: string; plain_text: string; }[]
}

export interface TextProperties {
  id: string
  type: "rich_text"
  rich_text: { type: string; plain_text: string; }[]
}

export interface NumberProperties {
  id: string
  type: "number"
  number: number
}

export interface SelectProperties {
  id: string
  type: "select"
  select: {
    id: string
    name: string
    color: string
  }
}

export interface StatusProperties {
  id: string
  type: "status"
  status: {
    id: string
    name: string
    color: string
  }
}

export interface DateProperties {
  id: string
  type: "date"
  date: {
    start: string
    end?: string
    time_zone: unknown
  }
}

export interface RelationProperties {
  id: string
  type: "relation"
  relation: { id: string, value?: string }[]
  has_more: boolean
}

export interface RollupProperties {
  id: string;
  type: "rollup";
  rollup: {
    type: "array";
    array: RollupPropertiesRollupArray[]
  };
}

export interface RollupPropertiesRollupArray {
  type: string;
  title: RollupPropertiesRollupArrayTitle[];
}

interface RollupPropertiesRollupArrayTitle {
  type: string;
  text: {
    content: string;
    link: string | null;
  }
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  }
  plain_text: string;
  href: string | null;
}

export type NotionDatabasePageProperties =
  TitleProperties |
  TextProperties |
  NumberProperties |
  SelectProperties |
  StatusProperties |
  DateProperties |
  RelationProperties |
  RollupProperties;

export type PageProperties = Record<string, NotionDatabasePageProperties>;

export interface Page {
  id: string
  created_time: string
  last_edited_time: string
  archived: boolean
  in_trash: boolean
  properties: PageProperties;
  url: string
  parent: { database_id: string };
}

export interface IPatternItem {
  id: string;
  created_time: string;
  last_edited_time: string;
  Match: string;
  Title: string;
  Category: TRelationProps;
  Subcategory: TRelationProps;
}

export interface ICategoryItem {
  id: string;
  created_time: string;
  last_edited_time: string;
  Title: string;
  Parent: TRelationProps[];
  Children: TRelationProps[];
}

export type ISubCategoryItem = Omit<ICategoryItem, "Parent"> & { Parent: TRelationProps };


export interface INotionTextObject {
  text: { content: string; };
}

export interface INotionRelationProperty {
  relation: { id: string }[];
}

export interface IPatternProperties {
  Match: { rich_text: INotionTextObject[]; };
  Title?: { title: INotionTextObject[]; };
  Category: INotionRelationProperty;
  Subcategory: INotionRelationProperty;
}

export interface ICreatePatternPayload {
  parent: {
    database_id: string;
  };
  properties: IPatternProperties;
}

export interface IUpdatePatternPayload {
  page_id: string;
  properties: IPatternProperties;
}

export type PatternNotionPayload = ICreatePatternPayload | IUpdatePatternPayload;




export interface ICategoryProperties {
  Title: { title: INotionTextObject[]; };
  Parent?: INotionRelationProperty;
}
export interface IExpenseProperties {
  key: { title: INotionTextObject[]; };
  Account: { rich_text: INotionTextObject[]; };
  "Account Type": { rich_text: INotionTextObject[]; };
  "Bank Description": { rich_text: INotionTextObject[]; };
  Description: { rich_text: INotionTextObject[]; };
  Date: { date: { start: string, end?: string } }
  Category?: { relation: { id: string }[]; }
  Subcategory?: { relation: { id: string }[]; }
  Balance: { number: number; }
  Total: { number: number; }
}

export interface ICreateNotionPayload<T> {
  parent: {
    database_id: string;
  };
  properties: T;
}

export interface IUpdateNotionPayload<T> {
  page_id: string;
  properties: T;
}

export type NotionPayload<T> = ICreateNotionPayload<T> | IUpdateNotionPayload<T>;

export interface IExpenseBase {
  id: string
  created_time: string
  last_edited_time: string
  key: string;
  Account: string;
  AccountType: string;
  BankDescription: string;
  Description: string;
  Balance: number;
  Total: number;
  TransactionMonth: string;
  Category?: TRelationProps;
  Subcategory?: TRelationProps;
}

export interface IExpenseItem extends IExpenseBase {
  TransactionDate: string;
}

export interface IExpenseFormItem extends IExpenseBase {
  TransactionDate: Dayjs;
}

export interface IRbcItem {
  key: string;
  AccountType: string;
  TransactionDate: string;
  Description1: string;
  Description2: string;
  Balance: number;
  Total: number;
}

export interface IConvertExpenseRule {
  match: string;
  Title?: string;
  Category: string;
  Subcategory: string;
}