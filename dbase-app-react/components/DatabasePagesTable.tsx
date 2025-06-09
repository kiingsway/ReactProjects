import { friendlyDate } from "@/app/services/helpers";
import { Page, SimplifiedPage } from "@/interfaces";
import Table, { ColumnsType } from "antd/es/table";
import React from "react";
import ColRelationRenderer from "./ColumnRenderers/ColRelationRenderer";
import UnhandledColumnRenderer from "./ColumnRenderers/UnhandledColumnRenderer";
import ColDate from "./ColumnRenderers/ColDate";
import ColRollup from "./ColumnRenderers/ColRollup";

export default function DatabasePagesTable({ databasePages }: { databasePages: Page[] }): React.JSX.Element {

  const dataSource = databasePages.map(simplifyPage);

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

function simplePageToTableColumn(samplePage: SimplifiedPage): ColumnsType<SimplifiedPage> {
  return samplePage.properties.map((prop) => ({
    title: prop.prop_name,
    dataIndex: ["properties", prop.prop_name],
    key: prop.prop_name,
    render: (_: unknown, record: SimplifiedPage): React.ReactNode => {
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