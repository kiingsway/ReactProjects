interface BaseProperties {
  id: string;
}

interface IBasePlainText {
  type: string;
  plain_text: string;
}

interface IBaseSelect {
  id: string
  name: string
  color: string
}

export interface TitleProperties extends BaseProperties {
  type: 'title'
  title: IBasePlainText[]
}

export interface TextProperties extends BaseProperties {
  type: 'rich_text'
  rich_text: IBasePlainText[]
}

export interface NumberProperties extends BaseProperties {
  type: 'number'
  number: number
}

export interface SelectProperties extends BaseProperties {
  type: 'select'
  select: IBaseSelect
}

export interface StatusProperties extends BaseProperties {
  type: 'status'
  status: IBaseSelect
}

export interface DateProperties extends BaseProperties {
  type: 'date'
  date: {
    start: string
    end?: string
    time_zone: unknown
  }
}

export interface RelationProperties extends BaseProperties {
  type: 'relation'
  relation: { id: string, value?: string }[]
  has_more: boolean
}

export interface RollupProperties extends BaseProperties {
  type: 'rollup';
  rollup: {
    type: 'array';
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