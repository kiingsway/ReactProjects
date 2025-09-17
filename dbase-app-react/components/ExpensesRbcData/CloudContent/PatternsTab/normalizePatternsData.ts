import { NotionDatabasePageProperties, Page, TextProperties, TitleProperties } from "@/interfaces";
import { IPatternItem } from "../interfaces";

export default function normalizePatternsData(patternsData: Page[]): IPatternItem[] {

  const getAsPage = (item: NotionDatabasePageProperties): Page => (item as unknown as Page[])[0];

  return patternsData.map(nitem => {

    const { id, created_time, last_edited_time } = nitem;

    const categoryPage = getAsPage(nitem.properties.Category);
    const subcategoryPage = getAsPage(nitem.properties.Subcategory);

    return {
      id, created_time, last_edited_time,
      Title: (nitem.properties.Title as TitleProperties).title[0]?.plain_text,
      Match: (nitem.properties.Match as TextProperties).rich_text[0]?.plain_text || "",
      Category: categoryPage && {
        id: categoryPage.id,
        text: (categoryPage.properties.Title as TitleProperties).title[0].plain_text,
      },
      Subcategory: subcategoryPage && {
        id: subcategoryPage.id,
        text: (subcategoryPage.properties.Title as TitleProperties).title[0].plain_text,
      }
    };
  });
}