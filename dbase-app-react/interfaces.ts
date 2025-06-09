import { Dayjs } from "dayjs";
import { BareFetcher, SWRConfiguration } from "swr";

export type TAdcTypes = "A1" | "B1" | "F1" | "PhHs";

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
  type: string
  text: {
    content: string
    link: string | null
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  plain_text: string
  href: string | null
}

export type NotionDatabasePageProperties = TitleProperties | TextProperties | NumberProperties | SelectProperties | StatusProperties | DateProperties | RelationProperties | RollupProperties;

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

export type PageProperties = Record<string, NotionDatabasePageProperties>;

export type NotionDatabasePagePropertiesName = NotionDatabasePageProperties & { prop_name: string };

export interface SimplifiedPage {
  id: string
  created_time: string
  last_edited_time: string
  archived: boolean
  in_trash: boolean
  properties: NotionDatabasePagePropertiesName[]
  url: string
}

export type SWRConfig<T> = SWRConfiguration<T, unknown, BareFetcher<T>>;

interface DBItem {
  id: string;
  created_time: string;
  last_edited_time: string;
  url: string;
  in_trash: boolean;
}

export interface DatabaseItem extends DBItem {
  title: { plain_text: string }[];
  properties: Record<string, { id: string; name: string, type: string }>;
};

export interface SimplifiedDatabaseItem extends DBItem {
  title: string;
  properties: { id: string; name: string, type: string }[];
};

export interface AddctFormItem {
  addct: string;
  date: Dayjs;
  quantity: number;
}