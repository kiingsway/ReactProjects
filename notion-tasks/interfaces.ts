import { NextResponse } from 'next/server';
import { NotionDatabasePageProperties } from './interfaces/intNotionColumns';
import { PageObjectResponse, PartialPageObjectResponse, PartialDatabaseObjectResponse, DatabaseObjectResponse } from '@notionhq/client';

export interface IDatabase {
  id: string;
  title: string;
  description?: string;
  created_time: string
  last_edited_time: string;
  properties: NotionDatabasePageProperties[];
}

export interface INotionDatabase {
  id: string
  created_time: string
  last_edited_time: string
  url: string
  archived: boolean
  in_trash: boolean
  title: INotionDatabaseTitle;
  description?: INotionDatabaseTitle;
  icon?: INotionDatabaseIcon
  properties: Record<string, NotionDatabasePageProperties>;
  parent: {
    type: string
    page_id: string
  }
}

export type INotionDatabaseTitle = Array<{
  plain_text: string
}>

export interface INotionDatabaseIcon {
  type: string
  external: {
    url: string
  }
}

export type TResponse = Promise<NextResponse<(
  PageObjectResponse |
  PartialPageObjectResponse |
  PartialDatabaseObjectResponse |
  DatabaseObjectResponse)[]> |
  NextResponse<{
    error: string;
  }>>




export interface INotionPage {
  id: string
  created_time: string
  last_edited_time: string
  url: string
  archived: boolean
  in_trash: boolean
  icon?: INotionDatabaseIcon
  properties: Record<string, NotionDatabasePageProperties>;
  parent: {
    type: string
    database_id: string
  }
}

export interface IProjectTask {
  id: string;
  created_time: string
  last_edited_time: string;
  [key: string]: string;
}

export interface ITasksColumn {
  name: string;
  type: 'number' | 'title' | 'status' | 'select' | 'rich_text' | 'date' | 'relation' | 'rollup';
}

export type TTaskPropValues = null | string;

export interface IStatusColors {
  status: { color: string; value: string; }[];
  priorities: { color: string; value: string; }[];
}