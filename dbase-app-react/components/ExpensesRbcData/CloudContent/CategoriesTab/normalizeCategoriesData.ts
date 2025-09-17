/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotionDatabasePageProperties, Page, TitleProperties } from "@/interfaces";
import { ICategoryItem } from "../interfaces";

export default function normalizeCategoriesData(categoriesData: Page[]): ICategoryItem[] {

  const getAsPage = (item: NotionDatabasePageProperties): Page => (item as unknown as Page[])[0];
  const getAsPages = (item: NotionDatabasePageProperties): Page[] => (item as unknown as Page[]) || [];

  return categoriesData.map(nitem => {

    const { id, created_time, last_edited_time } = nitem;

    const parentPage = getAsPage(nitem.properties.Parent);
    const childrenPages = getAsPages(nitem.properties.Children);

    return {
      id, created_time, last_edited_time,
      Title: (nitem.properties.Title as TitleProperties).title[0].plain_text,
      Parent: !parentPage ? undefined : {
        id: parentPage.id,
        text: (parentPage.properties.Title as TitleProperties).title[0].plain_text,
      },
      Children: childrenPages.map(cpage => ({
        id: cpage.id,
        text: (cpage.properties.Title as TitleProperties).title[0].plain_text,
      })),
    };
  });
}