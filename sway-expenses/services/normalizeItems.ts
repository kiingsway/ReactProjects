/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICategoryItem, IExpenseItem, IPatternItem, NotionDatabasePageProperties, TextProperties, TitleProperties } from "@/interfaces";
import { DateTime } from "luxon";

interface IIdName { id: string; name: string };

const getAsPage = (item: NotionDatabasePageProperties): IIdName => (item as unknown as IIdName[])[0];
const getAsPages = (item: NotionDatabasePageProperties): IIdName[] => (item as unknown as IIdName[]) || [];
const getTitle = (prop: TitleProperties): string => prop.title?.[0]?.plain_text || "";
const getRichText = (prop: TextProperties): string => prop.rich_text?.[0]?.plain_text || "";

export function normalizeCategories(itemsData: any[]): ICategoryItem[] {
  if (!itemsData || !Array.isArray(itemsData)) return [];

  return itemsData.map(item => {

    const { id, created_time, last_edited_time, properties } = item;
    const { Parent, Children, Title } = properties;

    const parentPages = getAsPages(Parent);
    const childrenPages = getAsPages(Children);

    return {
      id, created_time, last_edited_time,
      Title: getTitle(Title),
      Parent: parentPages.map(({ id, name }) => ({ id, name })),
      Children: childrenPages.map(({ id, name }) => ({ id, name })),
    };
  });

}

export function normalizePatterns(itemsData: any[]): IPatternItem[] {
  if (!itemsData || !Array.isArray(itemsData)) return [];

  return itemsData.map(item => {

    const { id, created_time, last_edited_time, properties } = item;
    const { Category, Subcategory, Title, Match } = properties;

    const categoryPage = getAsPage(Category);
    const subcategoryPage = getAsPage(Subcategory);

    return {
      id, created_time, last_edited_time,
      Title: getTitle(Title),
      Match: getRichText(Match),
      Category: categoryPage && { id: categoryPage.id, name: categoryPage.name },
      Subcategory: subcategoryPage && { id: subcategoryPage.id, name: subcategoryPage.name }
    };
  });
}

export function normalizeExpenses(itemsData: any[]): IExpenseItem[] {
  if (!itemsData || !Array.isArray(itemsData)) return [];

  return itemsData.map((item, index) => {

    const { id, created_time, last_edited_time, properties } = item;
    const { Account, Balance, Category, Date: TransactionDateString, Description, Subcategory, Total, key: keyData } = properties;

    const TransactionDate = TransactionDateString.date?.start;
    const TransactionMonth = TransactionDate ? DateTime.fromISO(TransactionDate).toFormat("(LL-yy) LLLL yyyy") : "";

    const key = keyData.title[0]?.plain_text || String(index);

    return {
      id, created_time, last_edited_time,
      Account: getRichText(Account),
      AccountType: getRichText(properties["Account Type"]),
      Balance: Balance.number,
      BankDescription: getRichText(properties["Bank Description"]),
      Category: Category[0],
      TransactionDate,
      TransactionMonth,
      Description: getRichText(Description),
      Subcategory: Subcategory[0],
      Total: Total.number,
      key,
    };
  });
}