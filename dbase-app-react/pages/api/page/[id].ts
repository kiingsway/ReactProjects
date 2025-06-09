// pages\api\page\[id].tsx
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import { NotionDatabasePageProperties, Page } from "@/interfaces";
import { sendError, sendSuccess } from "@/app/services/requests";
import { getErrorMessage } from "@/app/services/helpers";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { id: query_page_id } = req.query;

  if (typeof query_page_id !== "string") return sendError(res, "Invalid or missing page ID");

  try {
    switch (req.method) {
      case "GET": {
        const page = (await notion.pages.retrieve({ page_id: query_page_id })) as Page;

        const { id: pageId, created_time, last_edited_time, properties: pageProps } = page;

        const properties: Record<string, Page[] | NotionDatabasePageProperties> = {};

        for (const [name, value] of Object.entries(pageProps)) {
          if (value.type === "relation") {
            const related = await Promise.all(
              value.relation.map(async (r) =>
                (await notion.pages.retrieve({ page_id: r.id })) as Page
              ));
            properties[name] = related;
          } else {
            properties[name] = value;
          }
        }

        return sendSuccess(res, { id: pageId, created_time, last_edited_time, properties });
      }

      case "PUT": {
        if (!req.body || typeof req.body !== "object") {
          return sendError(res, "Missing or invalid body in PUT request", 400);
        }

        const updateResponse = await notion.pages.update({
          page_id: query_page_id,
          ...(req.body as object),
        });

        return sendSuccess(res, updateResponse, "Page updated successfully");
      }

      case "DELETE": {
        const archiveResponse = await notion.pages.update({
          page_id: query_page_id,
          archived: true,
        });

        return sendSuccess(res, archiveResponse, "Page deleted (archived) successfully");
      }

      default:
        return sendError(res, "Method not allowed", 405);
    }
  } catch (e: unknown) {
    const message = getErrorMessage(e);
    console.error("Error handling page:", message);
    return sendError(res, message, 500, { query_page_id });
  }
}
