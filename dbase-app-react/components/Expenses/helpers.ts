import { IExpenseItem, TypeCSV } from "./interfaces";

export function convertRBCDataToNotion(csvItems: TypeCSV[]): IExpenseItem[] {
  return csvItems.map(item => ({
    key: item.key,
    account: `RBC - ${item["Account Type"]}`,
    date: String(item["Transaction Date"]),
    title: `[${item["Description 1"]}] ${item["Description 2"]}`,
    category: "",
    subcategory: "",
    value: item["CAD$"] as number,
  }));
}