import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import { sendError, sendSuccess } from "@/app/services/requests";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(_req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const databases = [];
    let cursor: string | undefined = undefined;

    do {
      const response = await notion.search({
        filter: { property: "object", value: "database" },
        start_cursor: cursor,
        page_size: 100,
      });

      databases.push(...response.results);
      cursor = response.next_cursor || undefined;
    } while (cursor);

    return sendSuccess(res, databases);
  } catch (e: unknown) {
    let message = "Unknown error";

    if (e instanceof Error) {
      console.error("Error getting databases: ", e.message);
      message = e.message;
    } else {
      console.error("Unknown error: ", e);
    }

    return sendError(res, message);
  }
}
