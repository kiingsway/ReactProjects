import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import { sendError, sendSuccess } from "@/app/services/requests";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { databaseId } = req.query;

  if (!databaseId || typeof databaseId !== "string") {
    return sendError(res, "Parameter databaseId is missing or invalid", 400, { databaseId });
  }

  try {
    const pages = [];
    let cursor: string | undefined = undefined;

    do {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
      });

      pages.push(...response.results);
      cursor = response.has_more ? (response.next_cursor || undefined) : undefined;
    } while (cursor);

    return sendSuccess(res, pages);
  } catch (e: unknown) {
    const msg = `Error getting database pages: ${e instanceof Error && e.message ? e.message : "Unknown error"}`;

    console.error(msg);
    return sendError(res, msg);
  }
}
