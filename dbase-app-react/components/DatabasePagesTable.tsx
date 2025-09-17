import { friendlyDate, renderNotionDate } from "@/app/services/helpers";
import { Page, SimplifiedPage, TitleProperties } from "@/interfaces";
import Table, { ColumnsType } from "antd/es/table";
import React from "react";
import ColRelationRenderer from "./ColumnRenderers/ColRelationRenderer";
import UnhandledColumnRenderer from "./ColumnRenderers/UnhandledColumnRenderer";
import ColDate from "./ColumnRenderers/ColDate";
import ColRollup from "./ColumnRenderers/ColRollup";

export default function DatabasePagesTable({ databasePages }: { databasePages: Page[] }): React.JSX.Element {

  const dataSource = databasePages.map(simplifyPage);
  const dataSource1 = databasePages.map(handlePageToItem);
  console.log("dataSource1", dataSource1);

  const allDynamicColumns = dataSource
    .flatMap(simplePageToTableColumn)
    .filter((col, index, self) => index === self.findIndex(c => c.key === col.key));

  const columns: ColumnsType<SimplifiedPage> = [
    ...allDynamicColumns,
    { title: "Created", dataIndex: "created_time", key: "created_time", render: friendlyDate },
    { title: "Edited", dataIndex: "last_edited_time", key: "last_edited_time", render: friendlyDate },
  ];

  return (
    <Table
      size="small"
      rowKey="id"
      dataSource={dataSource}
      columns={columns}
      pagination={false} />
  );
}

function simplifyPage(page: Page): SimplifiedPage {

  const { id, created_time, last_edited_time, archived, in_trash, url } = page;

  return {
    id, created_time, last_edited_time, archived, in_trash, url,
    properties: Object.entries(page.properties).map(([prop_name, prop]) => ({ ...prop, prop_name }))
  };
}

type SelectProp = { id: string; text: string };
type DateProp = { start: string; end?: string };
type GenericItemValues = string | number | boolean | undefined | SelectProp[] | DateProp;

interface IGenericNotionItem {
  id: string;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  in_trash: boolean;
  url: string;
  properties: {
    [x: string]: GenericItemValues;
  }
}

function handlePageToItem(page: Page): IGenericNotionItem {

  const { id, created_time, last_edited_time, archived, in_trash, url } = page;

  const properties = Object.entries(page.properties).reduce((prev, [prop, value]) => {

    let newValue: GenericItemValues = undefined;

    if (Array.isArray(value)) {
      const pages = value as Page[];
      newValue = pages.map(p => ({
        id: p.id,
        text: (p.properties.Title as TitleProperties)?.title[0].plain_text
      }));
    } else {
      switch (value.type) {
        case "number":
          newValue = value[value.type] ?? null;
          break;
        case "select":
          newValue = value.select?.name ?? null;
          break;
        case "status":
          newValue = value.status?.name ?? null;
          break;
        case "title":
          newValue = value[value.type].map(t => t.plain_text).join("");
          break;
        case "rich_text":
          newValue = value[value.type].map(t => t.plain_text).join("");
          break;
        case "date":
          const { start, end } = value.date;
          newValue = { start, end };
          break;
        default:
          newValue = undefined;
          break;
      }
    }
    // else if (value.type === "title") newValue = value.title[0]?.plain_text;
    // else if (value.type === "rich_text") newValue = value.rich_text[0]?.plain_text;

    return { ...prev, [prop]: newValue };
  }, {} as Record<string, GenericItemValues>);

  return { id, created_time, last_edited_time, archived, in_trash, url, properties };
}

function simplePageToTableColumn(samplePage: SimplifiedPage): ColumnsType<SimplifiedPage> {
  return samplePage.properties.map(prop => ({
    title: prop.prop_name,
    dataIndex: ["properties", prop.prop_name],
    key: prop.prop_name,
    render: (_, record: SimplifiedPage): React.ReactNode => {
      const col = record.properties.find(p => p.prop_name === prop.prop_name);

      if (!col) return null;

      switch (col.type) {
        case "number":
          return col[col.type] ?? null;
        case "select":
          return col.select?.name ?? null;
        case "status":
          return col.status?.name ?? null;
        case "relation":
          return <ColRelationRenderer column={col} />;
        case "rollup":
          return <ColRollup column={col} />;
        case "title":
          return col[col.type].map(t => t.plain_text).join("");
        case "rich_text":
          return col[col.type].map(t => t.plain_text).join("");
        case "date":
          return <ColDate column={col} />;
        default:
          return <UnhandledColumnRenderer column={col} />;
      }
    },
  }));
}