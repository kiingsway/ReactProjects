import React from "react";
import { Tabs } from "antd";
import { ITab } from "../interfaces";
import CategoriesTab from "./CategoriesTab";
import CloudTab from "./CloudTab";
import ImportDataTab from "./ImportDataTab";
import PatternsTab from "./PatternsTab";
import { useDatabaseItems } from "./hooks/useDatabaseItems";
import normalizeCategoriesData from "./CategoriesTab/normalizeCategoriesData";
import { Page } from "@/interfaces";
import normalizePatternsData from "./PatternsTab/normalizePatternsData";

export default function CloudContent(): React.JSX.Element {

  const catPropsData = useDatabaseItems(process.env.NEXT_PUBLIC_CATEGORIES_DB_ID);
  const patPropsData = useDatabaseItems(process.env.NEXT_PUBLIC_PATTERNS_DB_ID);

  const categories = React.useMemo(() => normalizeCategoriesData(catPropsData.items as Page[]), [catPropsData.items]);
  const patterns = React.useMemo(() => normalizePatternsData(patPropsData.items as Page[]), [patPropsData.items]);

  const catProps = { ...catPropsData, items: categories };
  const patProps = { ...patPropsData, items: patterns };

  const tabs: ITab[] = [
    { key: "not", label: "Cloud", children: <CloudTab patProps={patProps} /> },
    { key: "cat", label: "Categories", children: <CategoriesTab catProps={catProps} /> },
    { key: "pat", label: "Patterns", children: <PatternsTab catProps={catProps} patProps={patProps} /> },
    { key: "imp", label: "Import Data", children: <ImportDataTab /> },
  ];

  return <Tabs items={tabs} />;
}