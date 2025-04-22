import React from "react";

export interface IQuickTableProps {
  columns: IQuickTableColumn[];
  data: any[];

  globalSearchable?: boolean
  counter?: boolean;

  searchPlaceholderText?: string;

  tableClassName?: string;
  thClassName?: string;
  tdClassName?: string;

  style?: IQuickTableStyle;
}

export interface IQuickTableColumn {
  title: string;
  acessor: string;
  sorteable?: boolean;
  filterable?: boolean;
  render?: (string) => JSX.Element;
}

export interface IFilterByField {
  acessor: string;
  value: string;
}

type PartialRecord<K extends string | number | symbol, T> = { [P in K]?: T; }

type TStylesTypes = 'all' | 'searchText' | 'counter' | 'table' | 'th' | 'td' | 'filterSelectOutline' | 'filterSelect'
export type IQuickTableStyle = PartialRecord<TStylesTypes, React.CSSProperties>