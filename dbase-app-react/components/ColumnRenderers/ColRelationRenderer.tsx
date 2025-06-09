import { RelationProperties } from "@/interfaces";
import { Tag } from "antd";
import React from "react";

export default function ColRelationRenderer({ column }: { column: RelationProperties }): React.JSX.Element {
  if (!column.relation.length) return <></>;

  const titles = column.relation.map(c => c.value).filter(Boolean) as string[];

  return <>{titles.map(title => <Tag key={title}>{title}</Tag>)}</>;
}