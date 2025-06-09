// pages\api\get_page\[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import { NotionDatabasePageProperties, Page } from "@/interfaces";
import { sendError, sendSuccess } from "@/app/services/requests";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  const { id: query_page_id } = req.query;
  if (typeof query_page_id !== "string") return sendError(res, "Invalid or missing page ID");

  try {
    const page = await notion.pages.retrieve({ page_id: query_page_id }) as Page;
    const { id: pageId, created_time, last_edited_time, properties: pageProps } = page;
    const properties: Record<string, Page[] | NotionDatabasePageProperties> = {};

    for (const [name, value] of Object.entries(pageProps)) {
      if (value.type === "relation") {
        const related = await Promise.all(
          value.relation.map(async r => await notion.pages.retrieve({ page_id: r.id }) as Page)
        );
        properties[name] = related;
      } else {
        properties[name] = value;
      }
    }

    return sendSuccess(res, { id: pageId, created_time, last_edited_time, properties });
  } catch (e: unknown) {
    let message = "Unknown error";
    if (e instanceof Error) {
      console.error("Error retrieving page:", e.message);
      message = e.message;
    } else {
      console.error(message, e);
    }
    return sendError(res, message);
  }
}
